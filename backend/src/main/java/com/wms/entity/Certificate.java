package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Certificates", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"UserId", "CourseId"}),
        @UniqueConstraint(columnNames = {"VerifyCode"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

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

    @Column(name = "VerifyCode", nullable = false, unique = true, length = 100)
    private String verifyCode;

    @CreationTimestamp
    @Column(name = "IssuedAt", nullable = false, updatable = false)
    private LocalDateTime issuedAt;
}
