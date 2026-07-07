package com.wms.dto;

import com.wms.enums.CourseLevel;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseLearningDTO {
    private UUID courseId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private CourseLevel level;
    private int totalLessons;
    private int completedLessons;
    private int progressPercent;
    private int totalTimeSpentSeconds;
    private LocalDateTime enrolledAt;
    private List<LearningLessonDTO> lessons;
}
