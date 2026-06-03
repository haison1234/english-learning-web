package com.wms.entity;

import com.wms.enums.UserRole;
import com.wms.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "FullName", nullable = false, length = 150)
    private String fullName;

    @Column(name = "Email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "PasswordHash", length = 512)
    private String passwordHash;

    @Column(name = "AvatarUrl", length = 500)
    private String avatarUrl;

    @Column(name = "Role", nullable = false)
    private UserRole role;

    @Column(name = "Status", nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "EmailVerified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "OAuthProvider", length = 50)
    private String oAuthProvider;

    @Column(name = "OAuthId", length = 255)
    private String oAuthId;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UpdatedAt", nullable = false)
    private LocalDateTime updatedAt;
}
