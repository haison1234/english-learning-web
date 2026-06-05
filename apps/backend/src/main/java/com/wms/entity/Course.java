package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, columnDefinition = "TINYINT")
    private Integer level; // 0: Beginner, 1: Intermediate, 2: Advanced

    @Column(precision = 12, scale = 0)
    private BigDecimal price;

    @Column(columnDefinition = "TINYINT")
    private Integer status; // 0: Draft, 1: Published

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String metadata; // JSON: description, thumbnailUrl, trailerUrl

    @Column(updatable = false)
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
            status = 0;
        }
    }
}
