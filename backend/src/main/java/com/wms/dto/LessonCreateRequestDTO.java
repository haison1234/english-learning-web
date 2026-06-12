package com.wms.dto;

import com.wms.enums.LessonContentType;
import lombok.Data;

@Data
public class LessonCreateRequestDTO {
    private String title;
    private LessonContentType contentType;
    private String contentUrl;
    private String textContent;
    private int durationSeconds;
    private boolean isPreview;
}