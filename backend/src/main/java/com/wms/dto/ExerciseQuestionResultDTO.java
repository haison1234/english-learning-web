package com.wms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseQuestionResultDTO {
    private String questionId;
    private String type;
    private String prompt;
    private Object submittedAnswer;
    private Object correctAnswer;
    private boolean correct;
    private String explanation;
}
