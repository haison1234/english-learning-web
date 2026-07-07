package com.wms.entity;

import com.wms.enums.CourseLevel;
import com.wms.enums.CourseStatus;
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
    @Column(name = "Id")
    private UUID id;

    @Column(name = "Title",nullable = false, length = 300)
    private String title;

    @Column(name = "Level",nullable = false)
    private CourseLevel level; // Tự động kích hoạt CourseLevelConverter để lưu kiểu số xuống TINYINT

    @Column(name = "Price",precision = 12, scale = 0)
    private BigDecimal price;

    @Column(name = "Status")
    private CourseStatus status; // 0: Draft, 1: Published

    @Column(name = "Metadata",columnDefinition = "NVARCHAR(MAX)")
    private String metadata; // JSON: description, thumbnailUrl, trailerUrl

    @Column(name = "CreatedAt",updatable = false)
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
            status = CourseStatus.DRAFT;
        }
    }
}