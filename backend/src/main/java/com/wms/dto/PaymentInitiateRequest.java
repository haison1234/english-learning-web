package com.wms.dto;

import lombok.*;

/**
 * Request body khi khởi tạo thanh toán cho một khóa học
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateRequest {
    /** UUID của khóa học cần mua */
    private String courseId;

    /**
     * Phương thức thanh toán:
     * 0 = VNPAY, 1 = MOMO, 2 = BANK_CARD, 3 = FREE
     */
    private int method;

    /** Mã coupon (tuỳ chọn) */
    private String couponCode;
}
