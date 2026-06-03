package com.wms.service;

import com.wms.dto.CourseDTO;
import com.wms.dto.CourseDetailDTO;
import com.wms.dto.LessonDTO;
import com.wms.entity.Course;
import com.wms.entity.Lesson;
import com.wms.exception.ResourceNotFoundException;
import com.wms.mapper.CourseMapper;
import com.wms.repository.CourseRepository;
import com.wms.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final LessonRepository lessonRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(courseMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CourseDetailDTO getCourseDetail(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(id);

        List<LessonDTO> lessonDTOs = lessons.stream()
                .map(lesson -> LessonDTO.builder()
                        .id(lesson.getId())
                        .courseId(lesson.getCourse().getId())
                        .title(lesson.getTitle())
                        .contentType(lesson.getContentType())
                        .contentUrl(lesson.getContentUrl())
                        .textContent(lesson.getTextContent())
                        .durationSeconds(lesson.getDurationSeconds())
                        .orderIndex(lesson.getOrderIndex())
                        .isPreview(lesson.isPreview())
                        .createdAt(lesson.getCreatedAt())
                        .updatedAt(lesson.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return CourseDetailDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .level(course.getLevel())
                .courseType(course.getCourseType())
                .basePrice(course.getBasePrice())
                .thumbnailUrl(course.getThumbnailUrl())
                .trailerUrl(course.getTrailerUrl())
                .status(course.getStatus())
                .createdById(course.getCreatedBy() != null ? course.getCreatedBy().getId() : null)
                .createdByName(course.getCreatedBy() != null ? course.getCreatedBy().getFullName() : null)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .lessons(lessonDTOs)
                .build();
    }
}
