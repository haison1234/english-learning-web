package com.wms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class NotificationRequestDTO {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    @NotNull(message = "Loại thông báo không được để trống")
    private Integer type; // 0: IN_APP, 1: EMAIL, 2: BOTH

    @NotBlank(message = "Đối tượng nhận không được để trống")
    private String targetAudience; // "ALL" hoặc "COURSE"

    private UUID courseId; // Bắt buộc nếu targetAudience là "COURSE"
}