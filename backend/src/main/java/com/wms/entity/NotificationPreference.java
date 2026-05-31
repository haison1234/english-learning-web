package com.wms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "NotificationPreferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreference {

    @Id
    @Column(name = "UserId")
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "UserId")
    private User user;

    @Column(name = "NewAssignment", nullable = false)
    private boolean newAssignment = true;

    @Column(name = "DeadlineReminder", nullable = false)
    private boolean deadlineReminder = true;

    @Column(name = "CommentReply", nullable = false)
    private boolean commentReply = true;

    @Column(name = "CourseComplete", nullable = false)
    private boolean courseComplete = true;

    @Column(name = "EmailEnabled", nullable = false)
    private boolean emailEnabled = true;
}
