package com.wms.service;

import com.wms.dto.*;
import com.wms.entity.*;
import com.wms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CouponRepository couponRepository;
    private final com.wms.config.VnpayConfig vnpayConfig;

    /**
     * Khởi tạo một giao dịch thanh toán mới (PENDING).
     * Bảng Enrollment giờ đây gánh logic của Payment.
     */
    @Transactional
    public PaymentInitiateResponse initiatePayment(UUID userId, PaymentInitiateRequest req) {
        UUID courseId = UUID.fromString(req.getCourseId());

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Khóa học không tồn tại!"));

        if (course.getStatus() != null && course.getStatus() != com.wms.enums.CourseStatus.PUBLISHED) { // 1 = PUBLISHED
            throw new IllegalStateException("Khóa học này chưa được xuất bản!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại!"));

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            Enrollment existing = enrollmentRepository.findByUserIdAndCourseId(userId, courseId).get();
            if (existing.getPaymentStatus() == com.wms.enums.PaymentStatus.SUCCESS) {
                throw new IllegalStateException("Bạn đã đăng ký khóa học này rồi!");
            } else {
                // Xóa đăng ký cũ đang Pending để tạo lại
                enrollmentRepository.delete(existing);
            }
        }

        BigDecimal originalPrice = course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;
        Coupon coupon = null;

        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {
            Optional<Coupon> couponOpt = couponRepository.findByCode(req.getCouponCode().trim().toUpperCase());
            if (couponOpt.isPresent()) {
                Coupon c = couponOpt.get();
                int maxUses = c.getMaxUses() != null ? c.getMaxUses() : 1;
                int usedCount = c.getUsedCount() != null ? c.getUsedCount() : 0;
                
                boolean isValid = usedCount < maxUses && c.getExpiresAt().isAfter(LocalDateTime.now());

                if (isValid) {
                    coupon = c;
                    if (c.getIsPercent() != null && c.getIsPercent()) {
                        discountAmount = originalPrice
                                .multiply(c.getDiscountValue())
                                .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);
                    } else {
                        discountAmount = c.getDiscountValue().setScale(0, RoundingMode.DOWN);
                    }
                    discountAmount = discountAmount.min(originalPrice);
                }
            }
        }

        BigDecimal finalPrice = originalPrice.subtract(discountAmount).max(BigDecimal.ZERO);

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .coupon(coupon)
                .amount(finalPrice)
                .paymentStatus(finalPrice.compareTo(BigDecimal.ZERO) == 0 ? com.wms.enums.PaymentStatus.SUCCESS : com.wms.enums.PaymentStatus.PENDING) // 1 = SUCCESS, 0 = PENDING
                .progressData("{}") // JSON lưu vết rỗng
                .build();

        enrollmentRepository.save(enrollment);

        System.out.println("💳 Payment INITIATED: " + enrollment.getId() + " for course: " + course.getTitle());

        String paymentUrl = null;
        if (finalPrice.compareTo(BigDecimal.ZERO) > 0) {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_TxnRef = enrollment.getId().toString().replace("-", "");
            String vnp_OrderInfo = "Thanh toan don hang " + vnp_TxnRef;
            String orderType = "other";
            
            // VNPAY uses amount in VND multiplied by 100
            String vnp_Amount = String.valueOf(finalPrice.multiply(BigDecimal.valueOf(100)).longValue());
            String vnp_TmnCode = vnpayConfig.getTmnCode().trim();
            
            java.util.Map<String, String> vnp_Params = new java.util.HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", vnp_Amount);
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_Locale", "vn");
            
            // Fixed IP as backend doesn't have it unless passed
            vnp_Params.put("vnp_IpAddr", "127.0.0.1"); 
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", orderType);
            vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
            
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String vnp_CreateDate = java.time.LocalDateTime.now().format(formatter);
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            
            String vnp_ExpireDate = java.time.LocalDateTime.now().plusMinutes(15).format(formatter);
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
            
            // Construct query string and hash data
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            java.util.Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            java.util.Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    // Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(java.net.URLEncoder.encode(fieldValue, java.nio.charset.StandardCharsets.UTF_8));
                    
                    // Build query
                    query.append(java.net.URLEncoder.encode(fieldName, java.nio.charset.StandardCharsets.UTF_8));
                    query.append('=');
                    query.append(java.net.URLEncoder.encode(fieldValue, java.nio.charset.StandardCharsets.UTF_8));
                    
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            
            String queryUrl = query.toString();
            String vnp_SecureHash = com.wms.util.VnpayUtil.hmacSHA512(vnpayConfig.getHashSecret().trim(), hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            
            paymentUrl = vnpayConfig.getUrl() + "?" + queryUrl;
        }

        return PaymentInitiateResponse.builder()
                .paymentId(enrollment.getId().toString())
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .finalPrice(finalPrice)
                .currency("VND")
                .paymentUrl(paymentUrl)
                .message("Giao dịch đã khởi tạo thành công. Vui lòng xác nhận thanh toán.")
                .build();
    }

    /**
     * Xác nhận thanh toán thành công → Cập nhật Enrollment thành SUCCESS.
     */
    @Transactional
    public void confirmPayment(UUID userId, PaymentConfirmRequest req) {
        UUID enrollmentId = UUID.fromString(req.getPaymentId());

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Giao dịch không tồn tại!"));

        if (!enrollment.getUser().getId().equals(userId)) {
            throw new SecurityException("Bạn không có quyền xác nhận giao dịch này!");
        }

        if (enrollment.getPaymentStatus() == com.wms.enums.PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Giao dịch này đã được xử lý rồi!");
        }

        // Cập nhật trạng thái thanh toán thành công
        enrollment.setPaymentStatus(com.wms.enums.PaymentStatus.SUCCESS);
        enrollmentRepository.save(enrollment);

        // Cập nhật used count của coupon
        if (enrollment.getCoupon() != null) {
            Coupon c = enrollment.getCoupon();
            c.setUsedCount((c.getUsedCount() != null ? c.getUsedCount() : 0) + 1);
            couponRepository.save(c);
        }

        System.out.println("🎉 Payment CONFIRMED for Enrollment: " + enrollmentId);
    }

    /**
     * Lấy lịch sử thanh toán của user.
     * Tạm thời TODO: DTO chưa tương thích với việc bỏ bảng Payment, cần cập nhật DTO sau.
     */
    public List<PaymentDTO> getMyPayments(UUID userId) {
        return enrollmentRepository.findByUserId(userId).stream().map(e -> {
            return PaymentDTO.builder()
                    .id(e.getId())
                    .userId(e.getUser().getId())
                    .courseId(e.getCourse().getId())
                    .couponCode(e.getCoupon() != null ? e.getCoupon().getCode() : null)
                    .originalPrice(e.getCourse().getPrice())
                    .finalPrice(e.getAmount())
                    .currency("VND")
                    .status(e.getPaymentStatus() != null ? e.getPaymentStatus() : com.wms.enums.PaymentStatus.PENDING)
                    .createdAt(e.getEnrolledAt())
                    .paidAt(e.getPaymentStatus() == com.wms.enums.PaymentStatus.SUCCESS ? e.getEnrolledAt() : null)
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Validate coupon.
     */
    public CouponValidateResponse validateCoupon(String code, UUID courseId) {
        if (code == null || code.isBlank()) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .message("Mã coupon không được để trống.")
                    .build();
        }

        Optional<Coupon> couponOpt = couponRepository.findByCode(code.trim().toUpperCase());
        if (couponOpt.isEmpty()) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .message("Mã coupon không tồn tại.")
                    .build();
        }

        Coupon coupon = couponOpt.get();

        int maxUses = coupon.getMaxUses() != null ? coupon.getMaxUses() : 1;
        int usedCount = coupon.getUsedCount() != null ? coupon.getUsedCount() : 0;

        if (usedCount >= maxUses) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .message("Mã coupon đã hết lượt sử dụng.")
                    .build();
        }

        if (coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            return CouponValidateResponse.builder()
                    .valid(false)
                    .message("Mã coupon đã hết hạn.")
                    .build();
        }

        return CouponValidateResponse.builder()
                .valid(true)
                .discountType(coupon.getIsPercent() != null && coupon.getIsPercent() ? 0 : 1)
                .discountValue(coupon.getDiscountValue())
                .message("Mã coupon hợp lệ!")
                .build();
    }

    @Transactional
    public PaymentResponseDTO processVnpayIpn(java.util.Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        
        String signValue = com.wms.util.VnpayUtil.hashAllFields(params, vnpayConfig.getHashSecret());
        if (!signValue.equals(vnp_SecureHash)) {
            return PaymentResponseDTO.builder().status("97").message("Invalid Checksum").build();
        }
        
        String txnRefStr = params.get("vnp_TxnRef"); // This is Enrollment ID without hyphens
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        
        try {
            // Reconstruct UUID
            String enrollmentIdStr = txnRefStr.replaceFirst(
                "(\\p{XDigit}{8})(\\p{XDigit}{4})(\\p{XDigit}{4})(\\p{XDigit}{4})(\\p{XDigit}+)",
                "$1-$2-$3-$4-$5"
            );
            UUID enrollmentId = UUID.fromString(enrollmentIdStr);
            
            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
            if (enrollmentOpt.isEmpty()) {
                return PaymentResponseDTO.builder().status("01").message("Order not found").build();
            }
            
            Enrollment enrollment = enrollmentOpt.get();
            if (enrollment.getPaymentStatus() == com.wms.enums.PaymentStatus.SUCCESS) {
                return PaymentResponseDTO.builder().status("02").message("Order already confirmed").build();
            }
            
            if ("00".equals(vnp_ResponseCode)) {
                // Success
                enrollment.setPaymentStatus(com.wms.enums.PaymentStatus.SUCCESS); // 1 = SUCCESS
                
                // Update used count of coupon
                if (enrollment.getCoupon() != null) {
                    Coupon c = enrollment.getCoupon();
                    c.setUsedCount((c.getUsedCount() != null ? c.getUsedCount() : 0) + 1);
                    couponRepository.save(c);
                }
            } else {
                // Failed, we might want to set to 2 for FAILED or keep 0
                // We'll keep it 0 or delete it, for now we keep it
            }
            
            enrollmentRepository.save(enrollment);
            return PaymentResponseDTO.builder().status("00").message("Confirm Success").build();
            
        } catch (Exception e) {
            return PaymentResponseDTO.builder().status("99").message("Unknown error").build();
        }
    }

    @Transactional
    public PaymentResponseDTO verifyVnpayReturn(java.util.Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        
        String signValue = com.wms.util.VnpayUtil.hashAllFields(params, vnpayConfig.getHashSecret());
        if (!signValue.equals(vnp_SecureHash)) {
            return PaymentResponseDTO.builder().status("97").message("Invalid Checksum").build();
        }
        
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String txnRefStr = params.get("vnp_TxnRef"); // Enrollment ID
        
        if ("00".equals(vnp_ResponseCode)) {
            // Because IPN might fail on localhost, update DB here as well
            try {
                String enrollmentIdStr = txnRefStr.replaceFirst(
                    "(\\p{XDigit}{8})(\\p{XDigit}{4})(\\p{XDigit}{4})(\\p{XDigit}{4})(\\p{XDigit}+)",
                    "$1-$2-$3-$4-$5"
                );
                UUID enrollmentId = UUID.fromString(enrollmentIdStr);
                
                Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
                if (enrollmentOpt.isPresent()) {
                    Enrollment enrollment = enrollmentOpt.get();
                    if (enrollment.getPaymentStatus() == null || enrollment.getPaymentStatus() == com.wms.enums.PaymentStatus.PENDING) {
                        enrollment.setPaymentStatus(com.wms.enums.PaymentStatus.SUCCESS);
                        
                        if (enrollment.getCoupon() != null) {
                            Coupon c = enrollment.getCoupon();
                            c.setUsedCount((c.getUsedCount() != null ? c.getUsedCount() : 0) + 1);
                            couponRepository.save(c);
                        }
                        enrollmentRepository.save(enrollment);
                    }
                }
            } catch (Exception e) {
                // Ignore error, return success anyway if VNPAY says success
            }
            return PaymentResponseDTO.builder().status("00").message("Success").build();
        }
        
        return PaymentResponseDTO.builder().status(vnp_ResponseCode).message("Payment Failed").build();
    }
}

