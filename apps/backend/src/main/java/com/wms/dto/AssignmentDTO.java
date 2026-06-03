package com.wms.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDTO {
    private UUID id;
    private UUID courseId;
    private UUID lessonId;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private int maxAttempts;
    private BigDecimal passingScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
