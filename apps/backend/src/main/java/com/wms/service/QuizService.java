package com.wms.service;

import com.wms.dto.*;
import com.wms.entity.*;
import com.wms.exception.ResourceNotFoundException;
import com.wms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository optionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final QuizAnswerRepository answerRepository;

    // =====================================================
    // 1. Lấy Quiz theo Lesson
    // API:
    // GET /api/quizzes/{lessonId}
    // =====================================================
    public QuizDTO getQuizByLesson(UUID lessonId) {

        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Quiz không tồn tại"));

        List<Question> questions =
                questionRepository.findByQuizId(quiz.getId());

        List<QuestionDTO> questionDTOList = new ArrayList<>();

        for (Question question : questions) {

            List<QuestionOption> options =
                    optionRepository.findByQuestionId(question.getId());

            List<QuestionOptionDTO> optionDTOList = new ArrayList<>();

            for (QuestionOption option : options) {

                QuestionOptionDTO optionDTO =
                        QuestionOptionDTO.builder()
                                .id(option.getId())
                                .content(option.getContent())
                                .build();

                optionDTOList.add(optionDTO);
            }

            QuestionDTO questionDTO =
                    QuestionDTO.builder()
                            .id(question.getId())
                            .content(question.getContent())
                            .type(question.getType())
                            .score(question.getScore())
                            .options(optionDTOList)
                            .build();

            questionDTOList.add(questionDTO);
        }

        return QuizDTO.builder()
                .id(quiz.getId())
                .lessonId(lessonId)
                .title(quiz.getTitle())
                .totalScore(quiz.getTotalScore())
                .questions(questionDTOList)
                .build();
    }

    // =====================================================
    // 2. Nộp bài + Chấm điểm tự động
    // API:
    // POST /api/quizzes/submit
    // =====================================================
    @Transactional
    public QuizResultResponse submitQuiz(
            UUID userId,
            SubmitQuizRequest request) {

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Quiz không tồn tại"));

        // Tạo user tạm để gắn vào QuizAttempt
        User user = User.builder()
                .id(userId)
                .build();

        // Tạo lần làm bài mới
        QuizAttempt attempt = new QuizAttempt();

        attempt.setQuiz(quiz);
        attempt.setUser(user);
        attempt.setScore(0);
        attempt.setTotalScore(quiz.getTotalScore());

        attemptRepository.save(attempt);

        int totalScore = 0;

        // Duyệt từng câu trả lời học sinh gửi lên
        for (SubmitAnswerRequest answerReq : request.getAnswers()) {

            Question question =
                    questionRepository.findById(answerReq.getQuestionId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Question không tồn tại"));

            List<QuestionOption> options =
                    optionRepository.findByQuestionId(question.getId());

            String correctAnswer = "";

            // Tìm đáp án đúng
            for (QuestionOption option : options) {

                if (Boolean.TRUE.equals(option.getIsCorrect())) {

                    correctAnswer = option.getContent();
                    break;
                }
            }

            boolean isCorrect = false;

            if (correctAnswer != null
                    && answerReq.getAnswer() != null) {

                isCorrect = correctAnswer.trim()
                        .equalsIgnoreCase(
                                answerReq.getAnswer().trim());
            }

            int score = 0;

            if (isCorrect) {

                score = question.getScore();
                totalScore += score;
            }

            // Lưu chi tiết từng câu trả lời
            QuizAnswer answer = new QuizAnswer();

            answer.setAttempt(attempt);
            answer.setQuestion(question);
            answer.setStudentAnswer(answerReq.getAnswer());
            answer.setCorrectAnswer(correctAnswer);
            answer.setIsCorrect(isCorrect);
            answer.setScore(score);

            answerRepository.save(answer);
        }

        // Cập nhật tổng điểm
        attempt.setScore(totalScore);

        attemptRepository.save(attempt);

        // Trả kết quả cho frontend
        QuizResultResponse response =
                new QuizResultResponse();

        response.setAttemptId(attempt.getId());
        response.setScore(totalScore);
        response.setTotalScore(quiz.getTotalScore());

        if (quiz.getTotalScore() != null
                && quiz.getTotalScore() > 0) {

            response.setPercentage(
                    totalScore * 100.0
                            / quiz.getTotalScore());

        } else {

            response.setPercentage(0.0);
        }

        return response;
    }

    // =====================================================
    // 3. Xem lịch sử làm bài
    // API:
    // GET /api/quizzes/history
    // =====================================================
    public List<QuizHistoryResponse> getHistory(UUID userId) {

        List<QuizAttempt> attempts =
                attemptRepository.findByUserId(userId);

        List<QuizHistoryResponse> result =
                new ArrayList<>();

        for (QuizAttempt attempt : attempts) {

            QuizHistoryResponse item =
                    new QuizHistoryResponse();

            item.setAttemptId(attempt.getId());

            item.setQuizTitle(
                    attempt.getQuiz().getTitle());

            item.setScore(
                    attempt.getScore());

            item.setTotalScore(
                    attempt.getTotalScore());

            item.setSubmittedAt(
                    attempt.getSubmittedAt());

            result.add(item);
        }

        return result;
    }
}