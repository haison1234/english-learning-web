package com.wms.controller;

import com.wms.annotation.RequireAuth;
import com.wms.dto.*;
import com.wms.entity.User;
import com.wms.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * POST /api/v1/payments/initiate
     * Tạo giao dịch thanh toán mới (PENDING).
     * Yêu cầu đăng nhập.
     */
    @PostMapping("/initiate")
    @RequireAuth
    public ResponseEntity<?> initiatePayment(
            @RequestBody PaymentInitiateRequest request,
            HttpServletRequest httpRequest) {
        try {
            User currentUser = (User) httpRequest.getAttribute("currentUser");
            System.out.println("💳 INITIATE PAYMENT for user: " + currentUser.getEmail()
                    + " | course: " + request.getCourseId());

            PaymentInitiateResponse response = paymentService.initiatePayment(
                    currentUser.getId(), request);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    /**
     * POST /api/v1/payments/confirm
     * Xác nhận giao dịch thành công → tạo Enrollment.
     * Yêu cầu đăng nhập.
     */
    @PostMapping("/confirm")
    @RequireAuth
    public ResponseEntity<?> confirmPayment(
            @RequestBody PaymentConfirmRequest request,
            HttpServletRequest httpRequest) {
        try {
            User currentUser = (User) httpRequest.getAttribute("currentUser");
            System.out.println("✅ CONFIRM PAYMENT: " + request.getPaymentId()
                    + " | user: " + currentUser.getEmail());

            paymentService.confirmPayment(currentUser.getId(), request);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Thanh toán thành công! Khóa học đã được kích hoạt."
            ));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/payments/my
     * Lịch sử thanh toán của user hiện tại.
     * Yêu cầu đăng nhập.
     */
    @GetMapping("/my")
    @RequireAuth
    public ResponseEntity<List<PaymentDTO>> getMyPayments(HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        List<PaymentDTO> payments = paymentService.getMyPayments(currentUser.getId());
        return ResponseEntity.ok(payments);
    }

    /**
     * GET /api/v1/payments/coupon/validate?code=ABC&courseId=...
     * Kiểm tra tính hợp lệ của mã coupon.
     * Yêu cầu đăng nhập.
     */
    @GetMapping("/coupon/validate")
    @RequireAuth
    public ResponseEntity<?> validateCoupon(
            @RequestParam String code,
            @RequestParam String courseId,
            HttpServletRequest httpRequest) {
        try {
            CouponValidateResponse response = paymentService.validateCoupon(
                    code, UUID.fromString(courseId));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Mã coupon không hợp lệ: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/payments/vnpay-return
     * Endpoint cho Frontend gọi để kiểm tra trạng thái thanh toán sau khi redirect từ VNPAY.
     */
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> params) {
        try {
            PaymentResponseDTO response = paymentService.verifyVnpayReturn(params);
            if ("00".equals(response.getStatus())) {
                return ResponseEntity.ok(Map.of("success", true, "message", response.getMessage()));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", response.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/payments/vnpay-ipn
     * Webhook (Server-to-Server) cho VNPAY gọi để cập nhật trạng thái thanh toán vào DB.
     */
    @GetMapping("/vnpay-ipn")
    public ResponseEntity<?> vnpayIpn(@RequestParam Map<String, String> params) {
        try {
            PaymentResponseDTO response = paymentService.processVnpayIpn(params);
            
            // VNPAY requires a specific JSON response format for IPN: {"RspCode": "xx", "Message": "..."}
            return ResponseEntity.ok(Map.of(
                "RspCode", response.getStatus(),
                "Message", response.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "RspCode", "99",
                "Message", "Unknown error"
            ));
        }
    }
}

