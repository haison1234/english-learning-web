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
public class LessonDTO {
    private UUID id;
    private UUID courseId;
    private String title;
    private LessonContentType contentType;
    private String contentUrl;
    private String textContent;
    private int durationSeconds;
    private int orderIndex;
    private boolean isPreview;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
