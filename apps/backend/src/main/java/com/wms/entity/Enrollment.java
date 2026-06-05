package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId", nullable = false)
    private Course course;

    @Column(columnDefinition = "TINYINT")
    private Integer paymentStatus; // 0: Pending, 1: Success

    @Column(precision = 12, scale = 0)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CouponCode")
    private Coupon coupon;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String progressData; // JSON

    @Column(length = 100)
    private String certificateCode;

    @Column(updatable = false)
    private LocalDateTime enrolledAt;

    @PrePersist
    protected void onCreate() {
        if (enrolledAt == null) {
            enrolledAt = LocalDateTime.now();
        }
        if (paymentStatus == null) {
            paymentStatus = 0;
        }
        if (amount == null) {
            amount = BigDecimal.ZERO;
        }
    }
}
