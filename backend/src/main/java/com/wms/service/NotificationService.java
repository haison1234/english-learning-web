package com.wms.service;

import com.wms.dto.NotificationRequestDTO;
import com.wms.dto.NotificationResponseDTO;
import com.wms.entity.Enrollment;
import com.wms.entity.Notification;
import com.wms.entity.NotificationCampaign;
import com.wms.entity.User;
import com.wms.repository.EnrollmentRepository;
import com.wms.repository.NotificationCampaignRepository;
import com.wms.repository.NotificationRepository;
import com.wms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.wms.enums.UserRole;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wms.dto.StudentNotificationDTO;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationCampaignRepository campaignRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public NotificationResponseDTO sendNotification(NotificationRequestDTO request) {
        // 1. Lưu đợt gửi này vào lịch sử Campaign của Admin
        NotificationCampaign campaign = NotificationCampaign.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .type(request.getType())
                .targetAudience(request.getTargetAudience())
                .courseId(request.getCourseId())
                .build();
        NotificationCampaign savedCampaign = campaignRepository.save(campaign);

        // 2. Xác định danh sách học sinh nhận thông báo
        List<User> targetUsers = new ArrayList<>();
        if ("ALL".equalsIgnoreCase(request.getTargetAudience())) {
            targetUsers = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.STUDENT) // Chỉ gửi cho Student (role = STUDENT)
                    .collect(Collectors.toList());
        } else if ("COURSE".equalsIgnoreCase(request.getTargetAudience()) && request.getCourseId() != null) {
            targetUsers = enrollmentRepository.findByCourseId(request.getCourseId()).stream()
                    .map(Enrollment::getUser)
                    .distinct()
                    .collect(Collectors.toList());
        }

        if (targetUsers.isEmpty()) {
            return mapToDTO(savedCampaign);
        }

        // 3. Xử lý gửi IN_APP (0) hoặc BOTH (2): Insert vào bảng Notifications từng
        // dòng cho mỗi User
        if (request.getType() == 0 || request.getType() == 2) {
            List<Notification> inAppNotifications = targetUsers.stream()
                    .map(user -> Notification.builder()
                            .user(user)
                            .title(request.getTitle())
                            .message(request.getContent())
                            .isRead(false)
                            .build())
                    .collect(Collectors.toList());
            notificationRepository.saveAll(inAppNotifications);
            log.info("Đã lưu {} thông báo in-app vào DB.", inAppNotifications.size());
        }

        // 4. Xử lý gửi EMAIL (1) hoặc BOTH (2): Bắn mail hàng loạt bằng Gmail thật
        if (request.getType() == 1 || request.getType() == 2) {
            List<String> emailList = targetUsers.stream()
                    .map(User::getEmail)
                    .filter(email -> email != null && !email.isEmpty())
                    .collect(Collectors.toList());

            if (!emailList.isEmpty()) {
                sendBulkEmail(emailList, request.getTitle(), request.getContent());
            }
        }

        return mapToDTO(savedCampaign);
    }

    // Lấy lịch sử gửi thông báo của Admin
    public List<NotificationResponseDTO> getCampaignHistory() {
        return campaignRepository.findAllByOrderBySentAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Lấy danh sách thông báo của học sinh
    public List<StudentNotificationDTO> getStudentNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(n -> StudentNotificationDTO.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .message(n.getMessage())
                        .isRead(n.getIsRead())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    // Đánh dấu 1 thông báo là đã đọc
    @Transactional
    public void markAsRead(User user, UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông báo"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Bạn không có quyền đọc thông báo này");
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    // Đánh dấu tất cả thông báo là đã đọc
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalse(user);
        if (!unread.isEmpty()) {
            unread.forEach(n -> n.setIsRead(true));
            notificationRepository.saveAll(unread);
        }
    }

    private void sendBulkEmail(List<String> emails, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@elearning.com");
            // Sử dụng BCC để gửi đồng thời cho nhiều học sinh mà không lộ danh sách email
            // của nhau
            message.setBcc(emails.toArray(new String[0]));
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Đã gửi Gmail thật thành công tới {} địa chỉ học sinh.", emails.size());
        } catch (Exception e) {
            log.error("Gặp lỗi khi thực hiện gửi Gmail: ", e);
        }
    }

    private NotificationResponseDTO mapToDTO(NotificationCampaign campaign) {
        return NotificationResponseDTO.builder()
                .id(campaign.getId())
                .title(campaign.getTitle())
                .content(campaign.getContent())
                .type(campaign.getType())
                .targetAudience(campaign.getTargetAudience())
                .courseId(campaign.getCourseId())
                .sentAt(campaign.getSentAt())
                .build();
    }
}