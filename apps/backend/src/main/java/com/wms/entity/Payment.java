package com.wms.entity;

import com.wms.enums.PaymentMethod;
import com.wms.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "CourseId", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CouponId")
    private Coupon coupon;

    @Column(name = "OriginalPrice", nullable = false, precision = 12, scale = 0)
    private BigDecimal originalPrice;

    @Column(name = "DiscountAmount", nullable = false, precision = 12, scale = 0)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "FinalPrice", nullable = false, precision = 12, scale = 0)
    private BigDecimal finalPrice;

    @Column(name = "Currency", nullable = false, length = 3)
    private String currency = "VND";

    @Column(name = "Method", nullable = false)
    private PaymentMethod method;

    @Column(name = "TransactionRef", length = 255)
    private String transactionRef;

    @Column(name = "Status", nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "GatewayResponse", columnDefinition = "NVARCHAR(MAX)")
    private String gatewayResponse;

    @Column(name = "PaidAt")
    private LocalDateTime paidAt;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
