package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {
    @Id
    @Column(length = 50, nullable = false)
    private String code;

    @Column(precision = 12, scale = 0)
    private BigDecimal discountValue;

    @Column(columnDefinition = "BIT DEFAULT 1")
    private Boolean isPercent;

    private Integer maxUses;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer usedCount;

    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        if (isPercent == null) {
            isPercent = true;
        }
        if (usedCount == null) {
            usedCount = 0;
        }
    }
}
