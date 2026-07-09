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

import com.wms.annotation.RequireAuth;

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
    @RequireAuth({"ADMIN"})
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
    @RequireAuth({"ADMIN"})
    public LessonDTO updateLesson(
            @PathVariable UUID id,
            @RequestBody LessonCreateRequestDTO request) {
        return lessonService.updateLesson(id, request);
    }


    @DeleteMapping("/{id}")
    @RequireAuth({"ADMIN"})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLesson(@PathVariable UUID id) {
        lessonService.deleteLesson(id);
    }

    @PutMapping("/reorder")
    @RequireAuth({"ADMIN"})
    @ResponseStatus(HttpStatus.OK)
    public void reorderLessons(@RequestBody List<LessonReorderRequestDTO> requests) {
        lessonService.reorderLessons(requests);
    }

    @PostMapping("/course/{courseId}/assignment")
    @RequireAuth({"ADMIN"})
    @ResponseStatus(HttpStatus.CREATED)
    public LessonDTO createAssignment(
            @PathVariable UUID courseId,
            @Valid @RequestBody AssignmentCreateRequestDTO request) {
        return lessonService.createAssignment(courseId, request);
    }

    // Lấy chi tiết bài tập để Admin xem
    @GetMapping("/assignment/{lessonId}")
    @RequireAuth({"ADMIN"})
    public AssignmentCreateRequestDTO getAssignment(@PathVariable UUID lessonId) {
        return lessonService.getAssignment(lessonId);
    }

    // Sửa bài tập
    @PutMapping("/assignment/{lessonId}")
    @RequireAuth({"ADMIN"})
    public LessonDTO updateAssignment(
            @PathVariable UUID lessonId,
            @RequestBody AssignmentCreateRequestDTO request) {
        return lessonService.updateAssignment(lessonId, request);
    }
}