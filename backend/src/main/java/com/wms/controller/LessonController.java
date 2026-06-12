package com.wms.controller;

import com.wms.dto.AssignmentCreateRequestDTO;
import com.wms.dto.LessonCreateRequestDTO;
import com.wms.dto.LessonDTO;
import com.wms.dto.LessonReorderRequestDTO;
import com.wms.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    /**
     * API Tạo bài học mới cho một khóa học
     * POST http://localhost:8080/api/v1/lessons/course/{courseId}
     */
    @PostMapping("/course/{courseId}")
    @ResponseStatus(HttpStatus.CREATED)
    public LessonDTO createLesson(
            @PathVariable UUID courseId,
            @RequestBody LessonCreateRequestDTO request) {
        return lessonService.createLesson(courseId, request);
    }

    /**
     * API Cập nhật thông tin bài học
     * PUT http://localhost:8080/api/v1/lessons/{id}
     */
    @PutMapping("/{id}")
    public LessonDTO updateLesson(
            @PathVariable UUID id,
            @RequestBody LessonCreateRequestDTO request) {
        return lessonService.updateLesson(id, request);
    }

    /**
     * API Xóa một bài học
     * DELETE http://localhost:8080/api/v1/lessons/{id}
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Trả về HTTP Status 204 khi xóa thành công
    public void deleteLesson(@PathVariable UUID id) {
        lessonService.deleteLesson(id);
    }

    /**
     * API Thay đổi thứ tự danh sách bài học (Kéo thả)
     * PUT http://localhost:8080/api/v1/lessons/reorder
     */
    @PutMapping("/reorder")
    @ResponseStatus(HttpStatus.OK)
    public void reorderLessons(@RequestBody List<LessonReorderRequestDTO> requests) {
        lessonService.reorderLessons(requests);
    }
    @PostMapping("/course/{courseId}/assignment")
    @ResponseStatus(HttpStatus.CREATED)
    public LessonDTO createAssignment(
            @PathVariable UUID courseId,
            @Valid @RequestBody AssignmentCreateRequestDTO request) {
        return lessonService.createAssignment(courseId, request);
    }
    // Lấy chi tiết bài tập để Admin xem
    @GetMapping("/assignment/{lessonId}")
    public AssignmentCreateRequestDTO getAssignment(@PathVariable UUID lessonId) {
        return lessonService.getAssignment(lessonId);
    }

    // Sửa bài tập
    @PutMapping("/assignment/{lessonId}")
    public LessonDTO updateAssignment(
            @PathVariable UUID lessonId,
            @RequestBody AssignmentCreateRequestDTO request) {
        return lessonService.updateAssignment(lessonId, request);
    }

}