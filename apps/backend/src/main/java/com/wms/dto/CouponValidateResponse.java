package com.wms.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Response cho API validate coupon
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponValidateResponse {
    private boolean valid;
    /** 0 = PERCENTAGE, 1 = FIXED_AMOUNT */
    private int discountType;
    private BigDecimal discountValue;
    private String message;
}
