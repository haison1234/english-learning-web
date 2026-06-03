package com.wms.service;

import com.wms.dto.CourseDTO;
import com.wms.dto.CourseDetailDTO;
import com.wms.entity.Course;
import com.wms.entity.Lesson;
import com.wms.exception.ResourceNotFoundException;
import com.wms.mapper.CourseMapper;
import com.wms.repository.CourseRepository;
import com.wms.repository.LessonRepository;
import org.springframework.stereotype.Service;

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

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(courseMapper::toDTO).collect(Collectors.toList());
    }

    public CourseDetailDTO getCourseDetail(UUID id) {
        Course course = courseRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Khóa học không tồn tại: " + id));
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(id);
        return courseMapper.toCourseDetailDTO(course, lessons);
    }
}
