package com.wms.dto;

import com.wms.enums.AccessType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentDTO {
    private UUID id;
    private UUID userId;
    private UUID courseId;
    private UUID paymentId;
    private AccessType accessType;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
}
