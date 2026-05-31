package com.wms.entity;

import com.wms.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @Column(name = "Title", nullable = false, length = 200)
    private String title;

    @Column(name = "Body", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String body;

    @Column(name = "NotifType", nullable = false)
    private NotificationType notifType;

    @Column(name = "RelatedId")
    private UUID relatedId;

    @Column(name = "IsRead", nullable = false)
    private boolean isRead = false;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
