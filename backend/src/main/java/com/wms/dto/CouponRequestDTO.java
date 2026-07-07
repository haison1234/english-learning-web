package com.wms.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponRequestDTO {
    // Có thể để trống để hệ thống tự sinh mã ngẫu nhiên
    private String code;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    private BigDecimal discountValue;

    @NotNull(message = "Phải xác định loại giảm giá (% hoặc Tiền mặt)")
    private Boolean isPercent;

    @NotNull(message = "Giới hạn số lần sử dụng không được để trống")
    @Min(value = 1, message = "Số lần sử dụng phải lớn hơn hoặc bằng 1")
    private Integer maxUses;

    @NotNull(message = "Ngày hết hạn không được để trống")
    @Future(message = "Ngày hết hạn phải ở thời điểm tương lai")
    private LocalDateTime expiresAt;
}