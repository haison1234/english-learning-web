package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ExerciseAttempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EnrollmentId", nullable = false)
    private Enrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LessonId", nullable = false)
    private Lesson lesson;

    @Column(name = "Score", nullable = false)
    private Integer score;

    @Column(name = "TotalQuestions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "CorrectAnswers", nullable = false)
    private Integer correctAnswers;

    @Column(name = "SubmittedAnswers", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String submittedAnswers;

    @Column(name = "ResultData", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String resultData;

    @Column(name = "AttemptedAt", updatable = false)
    private LocalDateTime attemptedAt;

    @PrePersist
    protected void onCreate() {
        if (attemptedAt == null) {
            attemptedAt = LocalDateTime.now();
        }
        if (score == null) {
            score = 0;
        }
        if (totalQuestions == null) {
            totalQuestions = 0;
        }
        if (correctAnswers == null) {
            correctAnswers = 0;
        }
    }
}
