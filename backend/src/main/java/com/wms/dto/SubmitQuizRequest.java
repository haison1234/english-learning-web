package com.wms.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitQuizRequest {

    private UUID quizId;

    private List<SubmitAnswerRequest> answers;
}