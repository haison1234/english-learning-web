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
    @Column(name = "Code", length = 50, nullable = false)
    private String code;

    @Column(name = "DiscountValue", precision = 12, scale = 0)
    private BigDecimal discountValue;

    @Column(name = "IsPercent", columnDefinition = "BIT DEFAULT 1")
    private Boolean isPercent;

    @Column(name = "MaxUses")
    private Integer maxUses;

    @Column(name = "UsedCount", columnDefinition = "INT DEFAULT 0")
    private Integer usedCount;

    @Column(name = "ExpiresAt")
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
