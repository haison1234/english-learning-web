package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "payment_status", columnDefinition = "TINYINT")
    private com.wms.enums.PaymentStatus paymentStatus; // 0: Pending, 1: Success

    @Column(name = "amount", precision = 12, scale = 0)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_code")
    private Coupon coupon;

    @Column(name = "progress_data", columnDefinition = "NVARCHAR(MAX)")
    private String progressData; // JSON

    @Column(name = "certificate_code", length = 100)
    private String certificateCode;

    @Column(name = "enrolled_at", updatable = false)
    private LocalDateTime enrolledAt;

    @PrePersist
    protected void onCreate() {
        if (enrolledAt == null) {
            enrolledAt = LocalDateTime.now();
        }
        if (paymentStatus == null) {
            paymentStatus = com.wms.enums.PaymentStatus.PENDING;
        }
        if (amount == null) {
            amount = BigDecimal.ZERO;
        }
    }
}
