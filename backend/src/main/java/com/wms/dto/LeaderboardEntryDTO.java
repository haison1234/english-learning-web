package com.wms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private String fullName;
    private int completedCount;
    private int streakCount;
}
