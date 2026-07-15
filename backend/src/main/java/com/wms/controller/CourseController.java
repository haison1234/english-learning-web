package com.wms.controller;

import com.wms.dto.CourseDTO;
import com.wms.dto.CourseDetailDTO;
import com.wms.dto.CreateCourseRequestDTO;
import com.wms.enums.CourseStatus;
import com.wms.service.CourseService;
import com.wms.repository.EnrollmentRepository;
import com.wms.entity.Enrollment;
import com.wms.exception.ResourceNotFoundException;
import com.wms.annotation.RequireAuth;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final EnrollmentRepository enrollmentRepository;

    @GetMapping("/certificate/verify/{code}")
    public Map<String, Object> verifyCertificate(@PathVariable String code) {
        Enrollment enrollment = enrollmentRepository.findByCertificateCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chứng chỉ tương ứng với mã: " + code));
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String issuedAt = enrollment.getEnrolledAt().format(formatter);
        
        return Map.of(
            "studentName", enrollment.getUser().getFullName(),
            "courseTitle", enrollment.getCourse().getTitle(),
            "verifyCode", code,
            "issuedAt", issuedAt,
            "status", "valid"
        );
    }

    @GetMapping
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseDetailDTO getCourseDetail(@PathVariable UUID id) {
        return courseService.getCourseDetail(id);
    }

    // 1. API Tạo mới khóa học (US-A01)
    @PostMapping
    @RequireAuth({"ADMIN"})
    @ResponseStatus(HttpStatus.CREATED) // Tự động trả về HTTP Status 201 khi tạo thành công
    public CourseDTO createCourse(@RequestBody CreateCourseRequestDTO request) {
        return courseService.createCourse(request);
    }

    // 2. API Cập nhật trạng thái khóa học (DRAFT, PUBLISHED, ARCHIVED)
    @PatchMapping("/{id}/status")
    @RequireAuth({"ADMIN"})
    @ResponseStatus(HttpStatus.NO_CONTENT) // Tự động trả về HTTP Status 204 (Thành công và không cần trả về body)
    public void updateCourseStatus(
            @PathVariable UUID id,
            @RequestParam CourseStatus status) {
        courseService.updateCourseStatus(id, status);
    }
}