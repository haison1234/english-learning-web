package com.wms.controller;

import com.wms.annotation.RequireAuth;
import com.wms.dto.*;
import com.wms.entity.User;
import com.wms.service.LearningService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
public class StudentLearningController {
    private final LearningService learningService;

    @GetMapping("/courses")
    @RequireAuth({"STUDENT", "ADMIN"})
    public List<MyCourseLearningDTO> getMyCourses(HttpServletRequest request) {
        return learningService.getMyCourses(currentUser(request));
    }

    @GetMapping("/courses/{courseId}")
    @RequireAuth({"STUDENT", "ADMIN"})
    public CourseLearningDTO getCourseLearningDetail(
            @PathVariable UUID courseId,
            HttpServletRequest request
    ) {
        return learningService.getCourseLearningDetail(currentUser(request), courseId);
    }

    @PutMapping("/courses/{courseId}/lessons/{lessonId}/progress")
    @RequireAuth({"STUDENT", "ADMIN"})
    public LessonProgressDTO updateProgress(
            @PathVariable UUID courseId,
            @PathVariable UUID lessonId,
            @RequestBody ProgressUpdateRequest progressRequest,
            HttpServletRequest request
    ) {
        return learningService.updateProgress(currentUser(request), courseId, lessonId, progressRequest);
    }

    @GetMapping("/courses/{courseId}/lessons/{lessonId}/exercises")
    @RequireAuth({"STUDENT", "ADMIN"})
    public List<ExerciseQuestionDTO> getExercises(
            @PathVariable UUID courseId,
            @PathVariable UUID lessonId,
            HttpServletRequest request
    ) {
        return learningService.getExercises(currentUser(request), courseId, lessonId);
    }

    @PostMapping("/courses/{courseId}/lessons/{lessonId}/exercises/submit")
    @RequireAuth({"STUDENT", "ADMIN"})
    public ExerciseSubmitResponse submitExercise(
            @PathVariable UUID courseId,
            @PathVariable UUID lessonId,
            @RequestBody ExerciseSubmitRequest exerciseRequest,
            HttpServletRequest request
    ) {
        return learningService.submitExercise(currentUser(request), courseId, lessonId, exerciseRequest);
    }

    @GetMapping("/courses/{courseId}/lessons/{lessonId}/exercise-attempts")
    @RequireAuth({"STUDENT", "ADMIN"})
    public List<ExerciseAttemptDTO> getExerciseAttempts(
            @PathVariable UUID courseId,
            @PathVariable UUID lessonId,
            HttpServletRequest request
    ) {
        return learningService.getExerciseAttempts(currentUser(request), courseId, lessonId);
    }

    private User currentUser(HttpServletRequest request) {
        return (User) request.getAttribute("currentUser");
    }
}
