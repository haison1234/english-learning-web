package com.wms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wms.dto.LessonCreateRequestDTO;
import com.wms.dto.LessonDTO;
import com.wms.dto.LessonReorderRequestDTO;
import com.wms.entity.Course;
import com.wms.entity.Lesson;
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

}