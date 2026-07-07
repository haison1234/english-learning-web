package com.wms.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgressDTO {
    private UUID lessonId;
    private boolean completed;
    private int positionSeconds;
    private int timeSpentSeconds;
    private LocalDateTime lastUpdatedAt;
    private LocalDateTime completedAt;
    private String progressStatus;
}
