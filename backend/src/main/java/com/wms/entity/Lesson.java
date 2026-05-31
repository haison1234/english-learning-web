package com.wms.entity;

import com.wms.enums.LessonContentType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
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
    @Column(name = "Id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "CourseId", nullable = false)
    private Course course;

    @Column(name = "Title", nullable = false, length = 300)
    private String title;

    @Column(name = "ContentType", nullable = false)
    private LessonContentType contentType;

    @Column(name = "ContentUrl", length = 500)
    private String contentUrl;

    @Column(name = "TextContent", columnDefinition = "NVARCHAR(MAX)")
    private String textContent;

    @Column(name = "DurationSeconds", nullable = false)
    private int durationSeconds = 0;

    @Column(name = "OrderIndex", nullable = false)
    private int orderIndex = 0;

    @Column(name = "IsPreview", nullable = false)
    private boolean isPreview = false;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UpdatedAt", nullable = false)
    private LocalDateTime updatedAt;
}
