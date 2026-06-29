package com.wms.dto;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseSubmitRequest {
    private Map<String, Object> answers;
}
