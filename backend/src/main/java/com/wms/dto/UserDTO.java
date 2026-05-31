package com.wms.dto;

import com.wms.enums.UserRole;
import com.wms.enums.UserStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String avatarUrl;
    private UserRole role;
    private UserStatus status;
    private boolean emailVerified;
    private String oAuthProvider;
    private String oAuthId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
