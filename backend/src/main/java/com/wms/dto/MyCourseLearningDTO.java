package com.wms.dto;

import com.wms.enums.CourseLevel;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyCourseLearningDTO {
    private UUID courseId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private CourseLevel level;
    private int totalLessons;
    private int completedLessons;
    private int progressPercent;
    private int totalTimeSpentSeconds;
    private UUID nextLessonId;
    private LocalDateTime enrolledAt;
    private LocalDateTime lastUpdatedAt;
}
