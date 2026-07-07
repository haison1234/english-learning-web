package com.wms.controller;

import com.wms.dto.NotificationRequestDTO;
import com.wms.dto.NotificationResponseDTO;
import com.wms.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * API Gửi thông báo hàng loạt (In-app / Email)
     */
    @PostMapping("/send")
    @ResponseStatus(HttpStatus.CREATED)
    public NotificationResponseDTO sendNotification(@Valid @RequestBody NotificationRequestDTO request) {
        return notificationService.sendNotification(request);
    }

    /**
     * API Xem lịch sử các đợt gửi thông báo của Admin
     */
    @GetMapping("/history")
    public List<NotificationResponseDTO> getNotificationHistory() {
        return notificationService.getCampaignHistory();
    }
}