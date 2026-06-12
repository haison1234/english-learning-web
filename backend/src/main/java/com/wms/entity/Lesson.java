package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "Lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId", nullable = false)
    private Course course;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(columnDefinition = "BIT DEFAULT 0")
    private Boolean isPreview;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer orderIndex;

    @Column(columnDefinition = "TINYINT")
    private com.wms.enums.LessonContentType type;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String content; // JSON

    @PrePersist
    protected void onCreate() {
        if (isPreview == null) {
            isPreview = false;
        }
        if (orderIndex == null) {
            orderIndex = 0;
        }
    }
}
