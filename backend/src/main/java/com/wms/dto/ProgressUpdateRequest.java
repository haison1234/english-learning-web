package com.wms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressUpdateRequest {
    private Integer positionSeconds;
    private Integer timeSpentSeconds;
    private Boolean completed;
}
