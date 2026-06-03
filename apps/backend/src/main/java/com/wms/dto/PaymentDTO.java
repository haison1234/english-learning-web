package com.wms.dto;

import com.wms.enums.PaymentMethod;
import com.wms.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private UUID id;
    private UUID userId;
    private UUID courseId;
    private UUID couponId;
    private BigDecimal originalPrice;
    private BigDecimal discountAmount;
    private BigDecimal finalPrice;
    private String currency;
    private PaymentMethod method;
    private String transactionRef;
    private PaymentStatus status;
    private String gatewayResponse;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}
