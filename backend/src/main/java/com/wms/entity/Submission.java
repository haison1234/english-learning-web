package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "AssignmentId", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @Column(name = "Answers", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String answers; // JSON: {"questionId": "answer"}

    @Column(name = "Score", precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "IsPassed")
    private Boolean isPassed;

    @Column(name = "AttemptNumber", nullable = false)
    private int attemptNumber = 1;

    @CreationTimestamp
    @Column(name = "SubmittedAt", nullable = false, updatable = false)
    private LocalDateTime submittedAt;
}
