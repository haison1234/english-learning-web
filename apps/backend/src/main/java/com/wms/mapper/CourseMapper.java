package com.wms.mapper;

import com.wms.dto.CourseDTO;
import com.wms.dto.CourseDetailDTO;
import com.wms.dto.LessonDTO;
import com.wms.entity.Course;
import com.wms.entity.Lesson;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CourseMapper {

    public CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }
        return CourseDTO.builder()
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
                .build();
    }

    public CourseDetailDTO toCourseDetailDTO(Course course, List<Lesson> lessons) {
        if (course == null) {
            return null;
        }
        
        List<LessonDTO> lessonDTOs = null;
        if (lessons != null) {
            lessonDTOs = lessons.stream().map(this::toLessonDTO).collect(Collectors.toList());
        }

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

    public LessonDTO toLessonDTO(Lesson lesson) {
        if (lesson == null) {
            return null;
        }
        return LessonDTO.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse() != null ? lesson.getCourse().getId() : null)
                .title(lesson.getTitle())
                .contentType(lesson.getContentType())
                .contentUrl(lesson.getContentUrl())
                .textContent(lesson.getTextContent())
                .durationSeconds(lesson.getDurationSeconds())
                .orderIndex(lesson.getOrderIndex())
                .isPreview(lesson.isPreview())
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
