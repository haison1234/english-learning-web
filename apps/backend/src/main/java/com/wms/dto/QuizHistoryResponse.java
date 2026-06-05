package com.wms.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizHistoryResponse {

    private UUID attemptId;

    private String quizTitle;

    private Integer score;

    private Integer totalScore;

    private LocalDateTime submittedAt;
}