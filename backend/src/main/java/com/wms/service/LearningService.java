package com.wms.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wms.dto.*;
import com.wms.entity.Course;
import com.wms.entity.Enrollment;
import com.wms.entity.ExerciseAttempt;
import com.wms.entity.Lesson;
import com.wms.entity.LessonProgress;
import com.wms.entity.User;
import com.wms.enums.PaymentStatus;
import com.wms.exception.ForbiddenException;
import com.wms.exception.ResourceNotFoundException;
import com.wms.mapper.CourseMapper;
import com.wms.repository.EnrollmentRepository;
import com.wms.repository.ExerciseAttemptRepository;
import com.wms.repository.LessonProgressRepository;
import com.wms.repository.LessonRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningService {
    private static final String NOT_STARTED = "NOT_STARTED";
    private static final String IN_PROGRESS = "IN_PROGRESS";
    private static final String COMPLETED = "COMPLETED";

    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final ExerciseAttemptRepository exerciseAttemptRepository;
    private final CourseMapper courseMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public List<MyCourseLearningDTO> getMyCourses(User user) {
        return enrollmentRepository.findByUserIdAndPaymentStatus(user.getId(), PaymentStatus.SUCCESS)
                .stream()
                .map(this::toMyCourseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseLearningDTO getCourseLearningDetail(User user, UUID courseId) {
        Enrollment enrollment = requireActiveEnrollment(user, courseId);
        Course course = enrollment.getCourse();
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        Map<UUID, LessonProgress> progressByLesson = getProgressByLesson(enrollment.getId());
        CourseDTO courseDTO = courseMapper.toDTO(course);

        int completedLessons = countCompletedLessons(lessons, progressByLesson);
        return CourseLearningDTO.builder()
                .courseId(course.getId())
                .title(course.getTitle())
                .description(courseDTO.getDescription())
                .thumbnailUrl(courseDTO.getThumbnailUrl())
                .level(courseDTO.getLevel())
                .totalLessons(lessons.size())
                .completedLessons(completedLessons)
                .progressPercent(calculatePercent(completedLessons, lessons.size()))
                .totalTimeSpentSeconds(sumTimeSpent(progressByLesson))
                .enrolledAt(enrollment.getEnrolledAt())
                .lessons(lessons.stream()
                        .map(lesson -> toLessonDTO(lesson, progressByLesson.get(lesson.getId())))
                        .collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public LessonProgressDTO updateProgress(User user, UUID courseId, UUID lessonId, ProgressUpdateRequest request) {
        Enrollment enrollment = requireActiveEnrollment(user, courseId);
        Lesson lesson = requireLessonInCourse(courseId, lessonId);
        LessonProgress progress = lessonProgressRepository.findByEnrollmentIdAndLessonId(enrollment.getId(), lessonId)
                .orElseGet(() -> LessonProgress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .positionSeconds(0)
                        .timeSpentSeconds(0)
                        .completed(false)
                        .build());

        if (request.getPositionSeconds() != null) {
            progress.setPositionSeconds(Math.max(0, request.getPositionSeconds()));
        }
        if (request.getTimeSpentSeconds() != null) {
            int currentTime = progress.getTimeSpentSeconds() != null ? progress.getTimeSpentSeconds() : 0;
            progress.setTimeSpentSeconds(Math.max(currentTime, Math.max(0, request.getTimeSpentSeconds())));
        }
        if (Boolean.TRUE.equals(request.getCompleted())) {
            progress.setCompleted(true);
            if (progress.getCompletedAt() == null) {
                progress.setCompletedAt(LocalDateTime.now());
            }
        }

        LessonProgress saved = lessonProgressRepository.save(progress);
        checkAndGenerateCertificate(enrollment);
        return toProgressDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ExerciseQuestionDTO> getExercises(User user, UUID courseId, UUID lessonId) {
        requireActiveEnrollment(user, courseId);
        Lesson lesson = requireLessonInCourse(courseId, lessonId);
        return exerciseDefinitions(lesson).stream()
                .map(this::toQuestionDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExerciseSubmitResponse submitExercise(
            User user,
            UUID courseId,
            UUID lessonId,
            ExerciseSubmitRequest request
    ) {
        Enrollment enrollment = requireActiveEnrollment(user, courseId);
        Lesson lesson = requireLessonInCourse(courseId, lessonId);
        Map<String, Object> submittedAnswers = request != null && request.getAnswers() != null
                ? request.getAnswers()
                : Map.of();
        List<ExerciseDefinition> definitions = exerciseDefinitions(lesson);

        List<ExerciseQuestionResultDTO> results = new ArrayList<>();
        int correctAnswers = 0;
        for (ExerciseDefinition definition : definitions) {
            Object submittedAnswer = submittedAnswers.get(definition.id);
            boolean correct = isCorrect(definition, submittedAnswer);
            if (correct) {
                correctAnswers++;
            }
            results.add(ExerciseQuestionResultDTO.builder()
                    .questionId(definition.id)
                    .type(definition.type)
                    .prompt(definition.prompt)
                    .submittedAnswer(submittedAnswer)
                    .correctAnswer(definition.correctAnswer)
                    .correct(correct)
                    .explanation(definition.explanation)
                    .build());
        }

        int totalQuestions = definitions.size();
        int percentage = calculatePercent(correctAnswers, totalQuestions);
        ExerciseAttempt attempt = ExerciseAttempt.builder()
                .enrollment(enrollment)
                .lesson(lesson)
                .score(percentage)
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .submittedAnswers(writeJson(submittedAnswers))
                .resultData(writeJson(results))
                .build();
        ExerciseAttempt savedAttempt = exerciseAttemptRepository.save(attempt);

        markLessonCompletedByExercise(enrollment, lesson);
        checkAndGenerateCertificate(enrollment);

        return ExerciseSubmitResponse.builder()
                .attemptId(savedAttempt.getId())
                .score(percentage)
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .percentage(percentage)
                .submittedAt(savedAttempt.getAttemptedAt())
                .results(results)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ExerciseAttemptDTO> getExerciseAttempts(User user, UUID courseId, UUID lessonId) {
        Enrollment enrollment = requireActiveEnrollment(user, courseId);
        requireLessonInCourse(courseId, lessonId);
        return exerciseAttemptRepository.findByEnrollmentIdAndLessonIdOrderByAttemptedAtDesc(enrollment.getId(), lessonId)
                .stream()
                .map(this::toAttemptDTO)
                .collect(Collectors.toList());
    }

    private MyCourseLearningDTO toMyCourseDTO(Enrollment enrollment) {
        Course course = enrollment.getCourse();
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(course.getId());
        Map<UUID, LessonProgress> progressByLesson = getProgressByLesson(enrollment.getId());
        int completedLessons = countCompletedLessons(lessons, progressByLesson);
        UUID nextLessonId = lessons.stream()
                .filter(lesson -> !COMPLETED.equals(progressStatus(progressByLesson.get(lesson.getId()))))
                .map(Lesson::getId)
                .findFirst()
                .orElse(null);
        CourseDTO courseDTO = courseMapper.toDTO(course);

        return MyCourseLearningDTO.builder()
                .courseId(course.getId())
                .title(course.getTitle())
                .description(courseDTO.getDescription())
                .thumbnailUrl(courseDTO.getThumbnailUrl())
                .level(courseDTO.getLevel())
                .totalLessons(lessons.size())
                .completedLessons(completedLessons)
                .progressPercent(calculatePercent(completedLessons, lessons.size()))
                .totalTimeSpentSeconds(sumTimeSpent(progressByLesson))
                .nextLessonId(nextLessonId)
                .certificateCode(enrollment.getCertificateCode())
                .enrolledAt(enrollment.getEnrolledAt())
                .lastUpdatedAt(progressByLesson.values().stream()
                        .map(LessonProgress::getLastUpdatedAt)
                        .max(Comparator.naturalOrder())
                        .orElse(enrollment.getEnrolledAt()))
                .build();
    }

    private LearningLessonDTO toLessonDTO(Lesson lesson, LessonProgress progress) {
        LessonContent content = readLessonContent(lesson.getContent());
        return LearningLessonDTO.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .title(lesson.getTitle())
                .contentType(lesson.getType() != null ? lesson.getType() : com.wms.enums.LessonContentType.VIDEO)
                .contentUrl(content.url)
                .textContent(content.textContent)
                .durationSeconds(content.durationSeconds)
                .orderIndex(lesson.getOrderIndex() != null ? lesson.getOrderIndex() : 0)
                .preview(Boolean.TRUE.equals(lesson.getIsPreview()))
                .progressStatus(progressStatus(progress))
                .completed(progress != null && Boolean.TRUE.equals(progress.getCompleted()))
                .positionSeconds(progress != null && progress.getPositionSeconds() != null ? progress.getPositionSeconds() : 0)
                .timeSpentSeconds(progress != null && progress.getTimeSpentSeconds() != null ? progress.getTimeSpentSeconds() : 0)
                .lastUpdatedAt(progress != null ? progress.getLastUpdatedAt() : null)
                .completedAt(progress != null ? progress.getCompletedAt() : null)
                .build();
    }

    private LessonProgressDTO toProgressDTO(LessonProgress progress) {
        return LessonProgressDTO.builder()
                .lessonId(progress.getLesson().getId())
                .completed(Boolean.TRUE.equals(progress.getCompleted()))
                .positionSeconds(progress.getPositionSeconds() != null ? progress.getPositionSeconds() : 0)
                .timeSpentSeconds(progress.getTimeSpentSeconds() != null ? progress.getTimeSpentSeconds() : 0)
                .lastUpdatedAt(progress.getLastUpdatedAt())
                .completedAt(progress.getCompletedAt())
                .progressStatus(progressStatus(progress))
                .build();
    }

    private ExerciseQuestionDTO toQuestionDTO(ExerciseDefinition definition) {
        return ExerciseQuestionDTO.builder()
                .id(definition.id)
                .type(definition.type)
                .prompt(definition.prompt)
                .options(definition.options)
                .leftItems(definition.leftItems)
                .rightItems(definition.rightItems)
                .points(1)
                .build();
    }

    private ExerciseAttemptDTO toAttemptDTO(ExerciseAttempt attempt) {
        List<ExerciseQuestionResultDTO> results = readResults(attempt.getResultData());
        int percentage = attempt.getScore() != null ? attempt.getScore() : 0;
        return ExerciseAttemptDTO.builder()
                .id(attempt.getId())
                .score(percentage)
                .totalQuestions(attempt.getTotalQuestions() != null ? attempt.getTotalQuestions() : 0)
                .correctAnswers(attempt.getCorrectAnswers() != null ? attempt.getCorrectAnswers() : 0)
                .percentage(percentage)
                .attemptedAt(attempt.getAttemptedAt())
                .results(results)
                .build();
    }

    private Enrollment requireActiveEnrollment(User user, UUID courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId)
                .filter(enrollment -> enrollment.getPaymentStatus() == PaymentStatus.SUCCESS)
                .orElseThrow(() -> new ForbiddenException("Ban chua dang ky khoa hoc nay hoac thanh toan chua thanh cong."));
    }

    private Lesson requireLessonInCourse(UUID courseId, UUID lessonId) {
        return lessonRepository.findByIdAndCourseId(lessonId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay bai hoc: " + lessonId));
    }

    private Map<UUID, LessonProgress> getProgressByLesson(UUID enrollmentId) {
        Map<UUID, LessonProgress> progressByLesson = new LinkedHashMap<>();
        lessonProgressRepository.findByEnrollmentId(enrollmentId)
                .forEach(progress -> progressByLesson.put(progress.getLesson().getId(), progress));
        return progressByLesson;
    }

    private int countCompletedLessons(List<Lesson> lessons, Map<UUID, LessonProgress> progressByLesson) {
        return (int) lessons.stream()
                .filter(lesson -> COMPLETED.equals(progressStatus(progressByLesson.get(lesson.getId()))))
                .count();
    }

    private int sumTimeSpent(Map<UUID, LessonProgress> progressByLesson) {
        return progressByLesson.values().stream()
                .map(LessonProgress::getTimeSpentSeconds)
                .filter(value -> value != null)
                .mapToInt(Integer::intValue)
                .sum();
    }

    private int calculatePercent(int numerator, int denominator) {
        if (denominator <= 0) {
            return 0;
        }
        return (int) Math.round((numerator * 100.0) / denominator);
    }

    private String progressStatus(LessonProgress progress) {
        if (progress == null) {
            return NOT_STARTED;
        }
        if (Boolean.TRUE.equals(progress.getCompleted())) {
            return COMPLETED;
        }
        return IN_PROGRESS;
    }

    private void markLessonCompletedByExercise(Enrollment enrollment, Lesson lesson) {
        LessonProgress progress = lessonProgressRepository
                .findByEnrollmentIdAndLessonId(enrollment.getId(), lesson.getId())
                .orElseGet(() -> LessonProgress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .positionSeconds(0)
                        .timeSpentSeconds(0)
                        .completed(false)
                        .build());
        progress.setCompleted(true);
        if (progress.getCompletedAt() == null) {
            progress.setCompletedAt(LocalDateTime.now());
        }
        lessonProgressRepository.save(progress);
    }

    private List<ExerciseDefinition> exerciseDefinitions(Lesson lesson) {
        List<ExerciseDefinition> definitions = new ArrayList<>();

        definitions.add(ExerciseDefinition.builder()
                .id("mc-1")
                .type("MULTIPLE_CHOICE")
                .prompt("Choose the correct answer: She ______ English since she was a child.")
                .options(List.of("A. studies", "B. has studied", "C. studied", "D. is studying"))
                .correctAnswer("B")
                .explanation("Use present perfect with 'since she was a child'.")
                .build());

        definitions.add(ExerciseDefinition.builder()
                .id("blank-1")
                .type("FILL_BLANK")
                .prompt("Fill in the blank: I am highly interested _____ learning American pronunciation.")
                .correctAnswer("in")
                .explanation("The correct structure is 'interested in'.")
                .build());

        Map<String, String> matchingAnswer = new LinkedHashMap<>();
        matchingAnswer.put("Acquire", "Tiep thu, thu nhan");
        matchingAnswer.put("Fluency", "Troi chay, luu loat");
        matchingAnswer.put("Immersive", "Moi truong dam chim");
        definitions.add(ExerciseDefinition.builder()
                .id("match-1")
                .type("MATCHING")
                .prompt("Match each English word with its Vietnamese meaning.")
                .leftItems(List.copyOf(matchingAnswer.keySet()))
                .rightItems(List.copyOf(matchingAnswer.values()))
                .correctAnswer(matchingAnswer)
                .explanation("These are core vocabulary words for the lesson: " + lesson.getTitle() + ".")
                .build());

        return definitions;
    }

    private boolean isCorrect(ExerciseDefinition definition, Object submittedAnswer) {
        if ("MULTIPLE_CHOICE".equals(definition.type)) {
            String normalized = normalizeText(submittedAnswer);
            if (normalized.contains(".")) {
                normalized = normalized.substring(0, normalized.indexOf('.')).trim();
            }
            return normalizeText(definition.correctAnswer).equals(normalized);
        }

        if ("FILL_BLANK".equals(definition.type)) {
            return normalizeText(definition.correctAnswer).equals(normalizeText(submittedAnswer));
        }

        if ("MATCHING".equals(definition.type)) {
            Map<String, String> expected = objectMapper.convertValue(
                    definition.correctAnswer,
                    new TypeReference<Map<String, String>>() {
                    }
            );
            Map<String, String> submitted = objectMapper.convertValue(
                    submittedAnswer != null ? submittedAnswer : Map.of(),
                    new TypeReference<Map<String, String>>() {
                    }
            );
            return expected.equals(submitted);
        }

        return false;
    }

    private String normalizeText(Object value) {
        return value == null ? "" : value.toString().trim().toLowerCase(Locale.ROOT);
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            return "{}";
        }
    }

    private List<ExerciseQuestionResultDTO> readResults(String resultData) {
        try {
            return objectMapper.readValue(resultData, new TypeReference<List<ExerciseQuestionResultDTO>>() {
            });
        } catch (Exception e) {
            return List.of();
        }
    }

    private LessonContent readLessonContent(String rawContent) {
        LessonContent content = new LessonContent();
        if (rawContent == null || rawContent.isBlank()) {
            return content;
        }

        try {
            JsonNode root = objectMapper.readTree(rawContent);
            if (root.has("url")) {
                content.url = root.get("url").asText();
            }
            if (root.has("textContent")) {
                content.textContent = root.get("textContent").asText();
            }
            if (root.has("durationSeconds")) {
                content.durationSeconds = root.get("durationSeconds").asInt(0);
            }
        } catch (Exception ignored) {
            return content;
        }
        return content;
    }

    @Getter
    @Setter
    @Builder
    private static class ExerciseDefinition {
        private String id;
        private String type;
        private String prompt;
        private List<String> options;
        private List<String> leftItems;
        private List<String> rightItems;
        private Object correctAnswer;
        private String explanation;
    }

    private static class LessonContent {
        private String url;
        private String textContent;
        private int durationSeconds;
    }

    private void checkAndGenerateCertificate(Enrollment enrollment) {
        if (enrollment.getCertificateCode() != null) {
            return;
        }
        Course course = enrollment.getCourse();
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(course.getId());
        Map<UUID, LessonProgress> progressByLesson = getProgressByLesson(enrollment.getId());
        int completedLessons = countCompletedLessons(lessons, progressByLesson);

        if (lessons.size() > 0 && completedLessons == lessons.size()) {
            String certCode = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            enrollment.setCertificateCode(certCode);
            enrollmentRepository.save(enrollment);
        }
    }
}
