package com.wms.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultResponse {

    private UUID attemptId;

    private Integer score;

    private Integer totalScore;

    private Double percentage;
}