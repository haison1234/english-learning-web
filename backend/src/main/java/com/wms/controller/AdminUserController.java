package com.wms.controller;

import com.wms.dto.UserAdminDTO;
import com.wms.dto.UserHistoryDTO;
import com.wms.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<UserAdminDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminUserService.getAllUsersPaginated(page, size));
    }

    @PutMapping("/{userId}/toggle-status")
    public ResponseEntity<UserAdminDTO> toggleUserStatus(@PathVariable UUID userId) {
        return ResponseEntity.ok(adminUserService.toggleUserStatus(userId));
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<UserHistoryDTO> getUserHistory(@PathVariable UUID userId) {
        return ResponseEntity.ok(adminUserService.getUserHistory(userId));
    }
}