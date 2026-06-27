package com.wms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentScoreDTO {
    private UUID userId;
    private String fullName;
    private String email;
    private Double score;
    private Boolean isCompleted;
}