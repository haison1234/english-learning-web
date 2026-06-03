package com.wms.mapper;

import com.wms.dto.CourseDTO;
import com.wms.entity.Course;
import org.springframework.stereotype.Component;

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
}
