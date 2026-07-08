package com.wms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wms.dto.UserAdminDTO;
import com.wms.dto.UserHistoryDTO;
import com.wms.entity.Enrollment;
import com.wms.entity.User;
import com.wms.enums.UserRole;
import com.wms.enums.UserStatus;
import com.wms.exception.ResourceNotFoundException;
import com.wms.repository.EnrollmentRepository;
import com.wms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ObjectMapper objectMapper;

    // 1. Lấy danh sách người dùng
    public Page<UserAdminDTO> getAllUsersPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        // Thay vì findAll, giờ chỉ lấy Role = Student
        Page<User> userPage = userRepository.findByRole(UserRole.STUDENT, pageable);

        return userPage.map(user -> UserAdminDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build());
    }

    // 2. Khóa / Mở khóa tài khoản (Hàm cũ của bạn - Giữ nguyên)
    @Transactional
    public UserAdminDTO toggleUserStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + userId));

        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.INACTIVE);
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }

        User updatedUser = userRepository.save(user);

        return mapToDTO(updatedUser);
    }

    // 2.1 THÊM MỚI: Ép mở khóa trực tiếp (Dành riêng cho nút Mở khóa của Frontend)
    @Transactional
    public UserAdminDTO unlockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + userId));

        // Ép thẳng trạng thái về ACTIVE
        user.setStatus(UserStatus.ACTIVE);
        User updatedUser = userRepository.save(user);

        return mapToDTO(updatedUser);
    }

    // 3. Xem lịch sử học tập của học sinh
    public UserHistoryDTO getUserHistory(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + userId));

        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        List<UserHistoryDTO.CourseProgress> progressList = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Object progressObj = null;
            if (enrollment.getProgressData() != null && !enrollment.getProgressData().isEmpty()) {
                try {
                    progressObj = objectMapper.readTree(enrollment.getProgressData());
                } catch (Exception e) {
                    log.warn("Không thể parse ProgressData cho Enrollment ID: {}", enrollment.getId());
                }
            }

            progressList.add(UserHistoryDTO.CourseProgress.builder()
                    .courseTitle(enrollment.getCourse().getTitle())
                    .enrolledAt(enrollment.getEnrolledAt())
                    .paymentStatus(enrollment.getPaymentStatus())
                    .progressDetails(progressObj)
                    .build());
        }

        return UserHistoryDTO.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .enrolledCourses(progressList)
                .build();
    }

    // Hàm phụ để code gọn hơn
    private UserAdminDTO mapToDTO(User user) {
        return UserAdminDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}