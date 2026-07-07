package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {
    @Id
    @Column(name = "code", length = 50, nullable = false)
    private String code;

    @Column(name = "discount_value", precision = 12, scale = 0)
    private BigDecimal discountValue;

    @Column(name = "is_percent", columnDefinition = "BIT DEFAULT 1")
    private Boolean isPercent;

    @Column(name = "max_uses")
    private Integer maxUses;

    @Column(name = "used_count", columnDefinition = "INT DEFAULT 0")
    private Integer usedCount;

    @Column(name = "expires_at")
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
