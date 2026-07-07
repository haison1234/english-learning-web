package com.wms.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateCourseRequestDTO {
    private String title;
    private byte level;
    private BigDecimal price;
    private String description;
    private String thumbnailUrl;
    private String trailerUrl;
}