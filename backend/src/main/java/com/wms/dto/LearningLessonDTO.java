package com.wms.dto;

import com.wms.enums.LessonContentType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningLessonDTO {
    private UUID id;
    private UUID courseId;
    private String title;
    private LessonContentType contentType;
    private String contentUrl;
    private String textContent;
    private int durationSeconds;
    private int orderIndex;
    private boolean preview;
    private String progressStatus;
    private boolean completed;
    private int positionSeconds;
    private int timeSpentSeconds;
    private LocalDateTime lastUpdatedAt;
    private LocalDateTime completedAt;
}
