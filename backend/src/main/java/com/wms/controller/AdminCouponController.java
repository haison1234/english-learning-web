package com.wms.controller;

import com.wms.dto.CouponRequestDTO;
import com.wms.dto.CouponResponseDTO;
import com.wms.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.wms.annotation.RequireAuth;

@RestController
@RequestMapping("/api/v1/admin/coupons")
@RequiredArgsConstructor
public class AdminCouponController {

    private final CouponService couponService;

    // Admin tạo mã giảm giá
    @PostMapping
    @RequireAuth({"ADMIN"})
    public ResponseEntity<CouponResponseDTO> createCoupon(@Valid @RequestBody CouponRequestDTO request) {
        return new ResponseEntity<>(couponService.createCoupon(request), HttpStatus.CREATED);
    }

    // Admin lấy danh sách mã giảm giá để thống kê
    @GetMapping
    @RequireAuth({"ADMIN"})
    public ResponseEntity<List<CouponResponseDTO>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    // Admin hủy mã giảm giá (chỉ khi chưa ai dùng)
    @DeleteMapping("/{code}")
    @RequireAuth({"ADMIN"})
    public ResponseEntity<Void> deleteCoupon(@PathVariable String code) {
        couponService.deleteCoupon(code);
        return ResponseEntity.noContent().build();
    }
}