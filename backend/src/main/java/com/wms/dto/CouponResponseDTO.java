package com.wms.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CouponResponseDTO {
    private String code;
    private BigDecimal discountValue;
    private Boolean isPercent;
    private Integer maxUses;
    private Integer usedCount;
    private LocalDateTime expiresAt;
    private String status; // Trạng thái để Frontend dễ hiển thị: ACTIVE, EXPIRED, EXHAUSTED
}