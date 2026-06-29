package com.wms.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseSubmitResponse {
    private UUID attemptId;
    private int score;
    private int totalQuestions;
    private int correctAnswers;
    private int percentage;
    private LocalDateTime submittedAt;
    private List<ExerciseQuestionResultDTO> results;
}
