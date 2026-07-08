package com.wms.service;

import com.wms.dto.CouponRequestDTO;
import com.wms.dto.CouponResponseDTO;
import com.wms.entity.Coupon;
import com.wms.exception.BadRequestException;
import com.wms.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    // Bỏ các ký tự dễ nhầm lẫn (0, O, 1, I, l) để học sinh dễ nhập
    private static final String SAFE_CHARACTERS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final SecureRandom random = new SecureRandom();

    @Transactional
    public CouponResponseDTO createCoupon(CouponRequestDTO request) {
        String finalCode;

        // 1. Kiểm tra mã Admin nhập hoặc Tự động sinh
        if (request.getCode() != null && !request.getCode().trim().isEmpty()) {
            finalCode = request.getCode().trim().toUpperCase();
            if (couponRepository.existsById(finalCode)) {
                throw new BadRequestException("Mã giảm giá '" + finalCode + "' đã tồn tại!");
            }
        } else {
            finalCode = generateUniqueSafeCode();
        }

        // 2. Chặn lỗi (Strict Validation)
        if (request.getIsPercent()) {
            // Nếu là % thì phải nằm trong khoảng 1 -> 100
            if (request.getDiscountValue().compareTo(BigDecimal.ONE) < 0 ||
                    request.getDiscountValue().compareTo(new BigDecimal("100")) > 0) {
                throw new BadRequestException("Giảm giá theo %, giá trị phải từ 1 đến 100!");
            }
        } else {
            // Nếu là tiền mặt thì phải lớn hơn 0
            if (request.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Số tiền giảm giá phải lớn hơn 0 VNĐ!");
            }
        }

        // 3. Lưu vào Database
        Coupon coupon = Coupon.builder()
                .code(finalCode)
                .discountValue(request.getDiscountValue())
                .isPercent(request.getIsPercent())
                .maxUses(request.getMaxUses())
                .usedCount(0)
                .expiresAt(request.getExpiresAt())
                .build();

        return mapToDTO(couponRepository.save(coupon));
    }

    public List<CouponResponseDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Hàm sinh mã 8 ký tự ngẫu nhiên
    private String generateUniqueSafeCode() {
        String generatedCode;
        do {
            StringBuilder sb = new StringBuilder(8);
            for (int i = 0; i < 8; i++) {
                sb.append(SAFE_CHARACTERS.charAt(random.nextInt(SAFE_CHARACTERS.length())));
            }
            generatedCode = sb.toString();
        } while (couponRepository.existsById(generatedCode));
        return generatedCode;
    }

    private CouponResponseDTO mapToDTO(Coupon coupon) {
        String status = "ACTIVE";
        if (LocalDateTime.now().isAfter(coupon.getExpiresAt())) {
            status = "EXPIRED";
        } else if (coupon.getUsedCount() >= coupon.getMaxUses()) {
            status = "EXHAUSTED"; // Hết lượt
        }

        return CouponResponseDTO.builder()
                .code(coupon.getCode())
                .discountValue(coupon.getDiscountValue())
                .isPercent(coupon.getIsPercent())
                .maxUses(coupon.getMaxUses())
                .usedCount(coupon.getUsedCount())
                .expiresAt(coupon.getExpiresAt())
                .status(status)
                .build();
    }

    @Transactional
    public void deleteCoupon(String code) {
        Coupon coupon = couponRepository.findById(code)
                .orElseThrow(() -> new BadRequestException("Mã giảm giá không tồn tại!"));

        if (coupon.getUsedCount() != null && coupon.getUsedCount() > 0) {
            throw new BadRequestException(
                    "Mã '" + code + "' đã được sử dụng " + coupon.getUsedCount() +
                            " lần, không thể xóa. Bạn có thể để mã tự hết hạn.");
        }

        couponRepository.deleteById(code);
    }
}