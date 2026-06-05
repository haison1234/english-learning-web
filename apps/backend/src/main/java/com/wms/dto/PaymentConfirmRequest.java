package com.wms.dto;

import lombok.*;

/**
 * Request body để xác nhận thanh toán thành công (mock hoặc callback từ cổng)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentConfirmRequest {
    /** UUID của giao dịch cần xác nhận */
    private String paymentId;

    /** Mã tham chiếu giao dịch từ cổng thanh toán (có thể null khi mock) */
    private String transactionRef;
}
