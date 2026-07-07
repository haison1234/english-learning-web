package com.wms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentReportDTO {
    private String lessonTitle;
    private Double averageScore;
    private Map<String, Integer> distribution;
    private List<StudentScoreDTO> studentScores;
}