package com.wms.entity;

import com.wms.enums.LessonContentType;
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
    @Column(name = "Id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId", nullable = false)
    private Course course;

    @Column(name = "Title", nullable = false, length = 300)
    private String title;

    @Column(name = "IsPreview", columnDefinition = "BIT DEFAULT 0")
    private Boolean isPreview;

    @Column(name = "OrderIndex", columnDefinition = "INT DEFAULT 0")
    private Integer orderIndex;

    @Column(name = "Type", columnDefinition = "TINYINT")
    private LessonContentType type;

    @Column(name = "Content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

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