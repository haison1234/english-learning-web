package com.wms.controller;

import com.wms.annotation.RequireAuth;
import com.wms.dto.*;
import com.wms.entity.User;
import com.wms.service.QuizService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/{lessonId}")
    @RequireAuth({"STUDENT"})
    public QuizDTO getQuiz(
            @PathVariable UUID lessonId) {

        return quizService.getQuizByLesson(lessonId);
    }

    @PostMapping("/submit")
    @RequireAuth({"STUDENT"})
    public QuizResultResponse submitQuiz(
            @RequestBody SubmitQuizRequest request,
            HttpServletRequest httpRequest) {

        User user =
                (User) httpRequest.getAttribute("currentUser");

        return quizService.submitQuiz(
                user.getId(),
                request);
    }

//    @PostMapping("/submit")
//    public QuizResultResponse submitQuiz(
//            @RequestBody SubmitQuizRequest request) {
//
//        UUID testUserId =
//                UUID.fromString(
//                        "BF0E3110-EB8D-4667-BF15-E6EE46FC90C7"
//                );
//
//        return quizService.submitQuiz(
//                testUserId,
//                request);
//    }


    @GetMapping("/history")
    @RequireAuth({"STUDENT"})
    public List<QuizHistoryResponse> history(
            HttpServletRequest httpRequest) {

        User user =
                (User) httpRequest.getAttribute("currentUser");

        return quizService.getHistory(user.getId());
    }
}