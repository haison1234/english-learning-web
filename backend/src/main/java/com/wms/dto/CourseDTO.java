package com.wms.dto;

import com.wms.enums.CourseLevel;
import com.wms.enums.CourseStatus;
import com.wms.enums.CourseType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private UUID id;
    private String title;
    private String description;
    private CourseLevel level;
    private CourseType courseType;
    private BigDecimal basePrice;
    private String thumbnailUrl;
    private String trailerUrl;
    private CourseStatus status;
    private UUID createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
