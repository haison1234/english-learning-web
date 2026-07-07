package com.wms.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CourseResponseDTO {
    private UUID id;
    private String title;
    private byte level;
    private BigDecimal price;
    private byte status;
    private String description;
    private String thumbnailUrl;
    private String trailerUrl;
    private LocalDateTime createdAt;
}