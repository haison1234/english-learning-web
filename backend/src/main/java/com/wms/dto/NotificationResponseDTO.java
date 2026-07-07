package com.wms.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationResponseDTO {
    private UUID id;
    private String title;
    private String content;
    private Integer type;
    private String targetAudience;
    private UUID courseId;
    private LocalDateTime sentAt;
}