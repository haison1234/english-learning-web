package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "title", nullable = false, length = 300)
    private String title;

    @Column(name = "is_preview", columnDefinition = "BIT DEFAULT 0")
    private Boolean isPreview;

    @Column(name = "order_index", columnDefinition = "INT DEFAULT 0")
    private Integer orderIndex;

    @Column(name = "type", columnDefinition = "TINYINT")
    private com.wms.enums.LessonContentType type;

    @Column(name = "content", columnDefinition = "NVARCHAR(MAX)")
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
