package com.wms.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDTO {

    private UUID id;

    private UUID lessonId;

    private String title;

    private Integer totalScore;

    private List<QuestionDTO> questions;
}