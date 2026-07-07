package com.wms.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseQuestionDTO {
    private String id;
    private String type;
    private String prompt;
    private List<String> options;
    private List<String> leftItems;
    private List<String> rightItems;
    private int points;
}
