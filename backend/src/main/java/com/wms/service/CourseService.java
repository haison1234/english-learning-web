import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream().map(courseMapper::toDTO).collect(Collectors.toList());
    }

    public CourseDetailDTO getCourseDetail(UUID id) {
        Course course = courseRepository.findById(id).orElseThrow(
                () -> new CourseNotFoundException("Khóa học không tồn tại: " + id));
        return courseMapper.toCourseDetailDTO(course);
    }
}
