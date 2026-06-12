package com.wms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssignmentCreateRequestDTO {
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề quá dài")
    private String title;

    private String description;

    @NotNull(message = "Deadline không được để trống")
    @Future(message = "Deadline phải là tương lai")
    private LocalDateTime deadline;

    @Min(value = 1, message = "Tối thiểu 1 lần làm")
    @Max(value = 10, message = "Tối đa 10 lần làm")
    private int maxAttempts;

    @NotNull(message = "Điểm qua không được để trống")
    @DecimalMin("0.0") @DecimalMax("10.0")
    private BigDecimal passingScore;

    @NotEmpty(message = "Danh sách câu hỏi không được trống")
    private List<QuestionDTO> questions;
}