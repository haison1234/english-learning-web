package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "title", nullable = false, length = 300)
    private String title;

    @Column(name = "level", nullable = false, columnDefinition = "TINYINT")
    private com.wms.enums.CourseLevel level; // 0: Beginner, 1: Intermediate, 2: Advanced

    @Column(name = "price", precision = 12, scale = 0)
    private BigDecimal price;

    @Column(name = "status", columnDefinition = "TINYINT")
    private com.wms.enums.CourseStatus status; // 0: Draft, 1: Published

    @Column(name = "metadata", columnDefinition = "NVARCHAR(MAX)")
    private String metadata; // JSON: description, thumbnailUrl, trailerUrl

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (price == null) {
            price = BigDecimal.ZERO;
        }
        if (status == null) {
            status = com.wms.enums.CourseStatus.DRAFT;
        }
    }
}
