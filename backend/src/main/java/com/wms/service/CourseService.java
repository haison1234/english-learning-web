package com.wms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.wms.dto.CourseDTO;
import com.wms.dto.CourseDetailDTO;
import com.wms.dto.CreateCourseRequestDTO;
import com.wms.entity.Course;
import com.wms.entity.Lesson;
import com.wms.enums.CourseLevel;
import com.wms.enums.CourseStatus;
import com.wms.exception.ResourceNotFoundException;
import com.wms.mapper.CourseMapper;
import com.wms.repository.CourseRepository;
import com.wms.repository.LessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final CourseMapper courseMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(courseMapper::toDTO).collect(Collectors.toList());
    }

    public CourseDetailDTO getCourseDetail(UUID id) {
        Course course = courseRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Khóa học không tồn tại: " + id));
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(id);
        return courseMapper.toCourseDetailDTO(course, lessons);
    }

    @Transactional
    public CourseDTO createCourse(CreateCourseRequestDTO request) {
        Course course = new Course();
        course.setTitle(request.getTitle());

        course.setLevel(CourseLevel.fromValue(request.getLevel()));

        course.setPrice(request.getPrice());
        course.setStatus(CourseStatus.DRAFT);

        try {
            ObjectNode metadataNode = objectMapper.createObjectNode();
            metadataNode.put("description", request.getDescription());
            metadataNode.put("thumbnailUrl", request.getThumbnailUrl());
            // Bổ sung trailerUrl vào JSON để khớp với thiết kế bóc tách ở Mapper
            metadataNode.put("trailerUrl", request.getTrailerUrl());
            course.setMetadata(objectMapper.writeValueAsString(metadataNode));
        } catch (Exception e) {
            course.setMetadata("{}");
        }

        Course savedCourse = courseRepository.save(course);
        return courseMapper.toDTO(savedCourse);
    }

    @Transactional
    public void updateCourseStatus(UUID id, CourseStatus newStatus) {
        Course course = courseRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Khóa học không tồn tại: " + id));

        course.setStatus(newStatus);
        courseRepository.save(course);
    }
}