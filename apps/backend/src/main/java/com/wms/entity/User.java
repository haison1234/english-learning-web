package com.wms.entity;

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
    private UUID id;

    @Column(nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 512)
    private String passwordHash;

    @Column(columnDefinition = "TINYINT")
    private Integer role; // 0: Admin, 1: Student

    @Column(length = 512)
    private String verifyToken;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String metadata; // JSON: AvatarUrl, NotificationSettings, GoogleId

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (role == null) {
            role = 1; // Default to Student
        }
    }
}
