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
public class ExerciseAttemptDTO {
    private UUID id;
    private int score;
    private int totalQuestions;
    private int correctAnswers;
    private int percentage;
    private LocalDateTime attemptedAt;
    private List<ExerciseQuestionResultDTO> results;
}
