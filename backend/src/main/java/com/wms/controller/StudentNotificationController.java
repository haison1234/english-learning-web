package com.wms.controller;

import com.wms.annotation.RequireAuth;
import com.wms.dto.StudentNotificationDTO;
import com.wms.entity.User;
import com.wms.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student/notifications")
@RequiredArgsConstructor
public class StudentNotificationController {

    private final NotificationService notificationService;

    /**
     * API Lấy danh sách thông báo của học sinh hiện tại
     */
    @GetMapping
    @RequireAuth({"STUDENT", "ADMIN"})
    public List<StudentNotificationDTO> getMyNotifications(HttpServletRequest request) {
        return notificationService.getStudentNotifications(currentUser(request));
    }

    /**
     * API Đánh dấu 1 thông báo là đã đọc
     */
    @PutMapping("/{id}/read")
    @RequireAuth({"STUDENT", "ADMIN"})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(@PathVariable UUID id, HttpServletRequest request) {
        notificationService.markAsRead(currentUser(request), id);
    }

    /**
     * API Đánh dấu tất cả thông báo là đã đọc
     */
    @PutMapping("/read-all")
    @RequireAuth({"STUDENT", "ADMIN"})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead(HttpServletRequest request) {
        notificationService.markAllAsRead(currentUser(request));
    }

    private User currentUser(HttpServletRequest request) {
        return (User) request.getAttribute("currentUser");
    }
}
