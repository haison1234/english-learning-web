package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", length = 512)
    private String passwordHash;

    @Column(name = "role", columnDefinition = "TINYINT")
    private com.wms.enums.UserRole role; // 0: Admin, 1: Student

    @Column(name = "verify_token", length = 512)
    private String verifyToken;

    @Column(name = "metadata", columnDefinition = "NVARCHAR(MAX)")
    private String metadata; // JSON: AvatarUrl, NotificationSettings, GoogleId

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (role == null) {
            role = com.wms.enums.UserRole.STUDENT; // Default to Student
        }
    }
}
