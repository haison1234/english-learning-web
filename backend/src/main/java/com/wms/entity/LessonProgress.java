package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "LessonProgresses",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_lesson_progress_enrollment_lesson",
                columnNames = {"EnrollmentId", "LessonId"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress {
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

    @Column(name = "PositionSeconds", columnDefinition = "INT DEFAULT 0", nullable = false)
    private Integer positionSeconds;

    @Column(name = "TimeSpentSeconds", columnDefinition = "INT DEFAULT 0", nullable = false)
    private Integer timeSpentSeconds;

    @Column(name = "Completed", columnDefinition = "BIT DEFAULT 0", nullable = false)
    private Boolean completed;

    @Column(name = "LastUpdatedAt", nullable = false)
    private LocalDateTime lastUpdatedAt;

    @Column(name = "CompletedAt")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (positionSeconds == null) {
            positionSeconds = 0;
        }
        if (timeSpentSeconds == null) {
            timeSpentSeconds = 0;
        }
        if (completed == null) {
            completed = false;
        }
        if (lastUpdatedAt == null) {
            lastUpdatedAt = now;
        }
        if (Boolean.TRUE.equals(completed) && completedAt == null) {
            completedAt = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        LocalDateTime now = LocalDateTime.now();
        lastUpdatedAt = now;
        if (Boolean.TRUE.equals(completed) && completedAt == null) {
            completedAt = now;
        }
    }
}
