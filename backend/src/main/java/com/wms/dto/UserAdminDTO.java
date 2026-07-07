package com.wms.dto;

import com.wms.enums.UserStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserAdminDTO {
    private UUID id;
    private String fullName;
    private String email;
    private com.wms.enums.UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
}