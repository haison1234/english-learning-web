package com.wms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wms.dto.AssignmentCreateRequestDTO;
import com.wms.dto.LessonCreateRequestDTO;
import com.wms.dto.LessonDTO;
import com.wms.dto.LessonReorderRequestDTO;
import com.wms.entity.Course;
import com.wms.entity.Lesson;
import com.wms.enums.LessonContentType;
import com.wms.exception.ResourceNotFoundException;
import com.wms.mapper.CourseMapper;
import com.wms.repository.CourseRepository;
import com.wms.repository.LessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public LessonDTO createLesson(UUID courseId, LessonCreateRequestDTO request) {
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new ResourceNotFoundException("Khóa học không tồn tại: " + courseId));

        int nextOrderIndex = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId).size();

        Lesson lesson = new Lesson();
        lesson.setCourse(course);
        lesson.setTitle(request.getTitle());
        lesson.setType(request.getContentType());
        lesson.setIsPreview(request.isPreview());
        lesson.setOrderIndex(nextOrderIndex);



        try {
            var details = new Object() {
                public final String contentUrl = request.getContentUrl();
                public final String textContent = request.getTextContent();
                public final int durationSeconds = request.getDurationSeconds();
            };
            lesson.setContent(objectMapper.writeValueAsString(details));
        } catch (Exception e) {
            lesson.setContent("{}");
        }

        Lesson savedLesson = lessonRepository.save(lesson);
        return courseMapper.toLessonDTO(savedLesson);
    }

    @Transactional
    public LessonDTO updateLesson(UUID id, LessonCreateRequestDTO request) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Bài học không tồn tại: " + id));

        lesson.setTitle(request.getTitle());
        lesson.setType(request.getContentType());
        lesson.setIsPreview(request.isPreview());

        try {
            var details = new Object() {
                public final String contentUrl = request.getContentUrl();
                public final String textContent = request.getTextContent();
                public final int durationSeconds = request.getDurationSeconds();
            };
            lesson.setContent(objectMapper.writeValueAsString(details));
        } catch (Exception e) {
            lesson.setContent("{}");
        }

        Lesson updatedLesson = lessonRepository.save(lesson);
        return courseMapper.toLessonDTO(updatedLesson);
    }

    @Transactional
    public void deleteLesson(UUID id) {
        if (!lessonRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bài học không tồn tại: " + id);
        }
        lessonRepository.deleteById(id);
    }

    @Transactional
    public void reorderLessons(List<LessonReorderRequestDTO> requests) {
        if (requests == null || requests.isEmpty()) {
            return;
        }
        for (LessonReorderRequestDTO req : requests) {
            Lesson lesson = lessonRepository.findById(req.getLessonId()).orElseThrow(
                    () -> new ResourceNotFoundException("Bài học không tồn tại: " + req.getLessonId()));
            lesson.setOrderIndex(req.getNewOrderIndex());
            lessonRepository.save(lesson);
        }
    }

    @Transactional
    public LessonDTO createAssignment(UUID courseId, AssignmentCreateRequestDTO request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));

        Lesson lesson = new Lesson();
        lesson.setCourse(course);
        lesson.setTitle(request.getTitle());
        lesson.setType(LessonContentType.QUIZ);

        int nextOrder = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId).size();
        lesson.setOrderIndex(nextOrder);

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
            mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            String jsonContent = mapper.writeValueAsString(request);
            System.out.println("DEBUG JSON: " + jsonContent);
            lesson.setContent(jsonContent);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi ép kiểu dữ liệu bài tập: " + e.getMessage());
        }
        return courseMapper.toLessonDTO(lessonRepository.save(lesson));
    }

    @Transactional
    public AssignmentCreateRequestDTO getAssignment(UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Bài học không tồn tại"));

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            String jsonContent = lesson.getContent();

            AssignmentCreateRequestDTO assignment = mapper.readValue(jsonContent, AssignmentCreateRequestDTO.class);
            return assignment;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi đọc dữ liệu bài tập: " + e.getMessage());
        }
    }

    @Transactional
    public LessonDTO updateAssignment(UUID lessonId, AssignmentCreateRequestDTO request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Bài học không tồn tại"));

        // Cập nhật thông tin cơ bản
        lesson.setTitle(request.getTitle());

        // Nén lại dữ liệu mới vào JSON
        try {
            lesson.setContent(objectMapper.writeValueAsString(request));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi cập nhật bài tập");
        }

        return courseMapper.toLessonDTO(lessonRepository.save(lesson));
    }

}