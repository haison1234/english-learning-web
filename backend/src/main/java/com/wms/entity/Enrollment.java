package com.wms.entity;

import com.wms.enums.AccessType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"UserId", "CourseId"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

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
    @JoinColumn(name = "PaymentId")
    private Payment payment;

    @Column(name = "AccessType", nullable = false)
    private AccessType accessType = AccessType.FREE;

    @CreationTimestamp
    @Column(name = "EnrolledAt", nullable = false, updatable = false)
    private LocalDateTime enrolledAt;

    @Column(name = "CompletedAt")
    private LocalDateTime completedAt;
}
