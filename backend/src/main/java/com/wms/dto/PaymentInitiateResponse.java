package com.wms.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Response trả về sau khi khởi tạo giao dịch thanh toán thành công
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateResponse {
    private String paymentId;
    private BigDecimal originalPrice;
    private BigDecimal discountAmount;
    private BigDecimal finalPrice;
    private String currency;
    private String message;
    private String paymentUrl;
}
