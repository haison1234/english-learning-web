package com.wms.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {

    private UUID id;

    private String content;

    private Integer type;

    private Integer score;

    private List<QuestionOptionDTO> options;
}