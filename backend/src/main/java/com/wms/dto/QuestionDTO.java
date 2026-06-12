package com.wms.dto;

import com.wms.enums.QuestionType;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class QuestionDTO {
    private String text;
    private QuestionType type; // MULTIPLE_CHOICE, FILL_IN, MATCHING
    private List<String> options;
    private String correctAnswer;
    private Map<String, String> pairs;
}