package com.wms.entity;


import com.wms.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
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
    @Column(name = "Id")
    private UUID id;

    @Column(name = "FullName", nullable = false, length = 150)
    private String fullName;

    @Column(name = "Email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "PasswordHash", length = 512)
    private String passwordHash;

    @Column(name = "Role", columnDefinition = "TINYINT")
    private com.wms.enums.UserRole role; // 0: Admin, 1: Student

    @Column(name = "VerifyToken", length = 512)
    private String verifyToken;

    @Column(name = "Metadata", columnDefinition = "NVARCHAR(MAX)")
    private String metadata; // JSON: AvatarUrl, NotificationSettings, GoogleId

    @Column(name = "Status", columnDefinition = "TINYINT")
    private UserStatus status;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (role == null) {
            role = com.wms.enums.UserRole.STUDENT; // Default to Student
        }
        if (status == null) {
            status = UserStatus.ACTIVE;
        }
    }
}
