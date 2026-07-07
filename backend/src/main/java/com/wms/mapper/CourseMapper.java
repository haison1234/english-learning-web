package com.wms.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wms.dto.CourseDTO;
import com.wms.dto.CourseDetailDTO;
import com.wms.dto.LessonDTO;
import com.wms.entity.Course;
import com.wms.entity.Lesson;
import com.wms.enums.CourseLevel;
import com.wms.enums.CourseStatus;
import com.wms.enums.CourseType;
import com.wms.enums.LessonContentType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CourseMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }

        String description = null;
        String thumbnailUrl = null;
        String trailerUrl = null;

        if (course.getMetadata() != null && !course.getMetadata().isEmpty()) {
            try {
                JsonNode jsonNode = objectMapper.readTree(course.getMetadata());
                if (jsonNode.has("description")) description = jsonNode.get("description").asText();
                if (jsonNode.has("thumbnailUrl")) thumbnailUrl = jsonNode.get("thumbnailUrl").asText();
                if (jsonNode.has("trailerUrl")) trailerUrl = jsonNode.get("trailerUrl").asText();
            } catch (Exception e) {
                // Ignore parse errors
            }
        }

        int courseTypeInt = (course.getPrice() != null && course.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0) ? 1 : 0;
        CourseType courseTypeEnum = CourseType.values()[courseTypeInt];
        CourseStatus statusEnum = course.getStatus() != null ? course.getStatus() : CourseStatus.DRAFT;

        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(description)
                .level(course.getLevel() != null ? course.getLevel() : CourseLevel.BEGINNER)
                .courseType(courseTypeEnum)
                .basePrice(course.getPrice())
                .thumbnailUrl(thumbnailUrl)
                .trailerUrl(trailerUrl)
                .status(statusEnum)
                .createdById(null)
                .createdByName(null)
                .createdAt(course.getCreatedAt())
                .updatedAt(null)
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

        String description = null;
        String thumbnailUrl = null;
        String trailerUrl = null;

        if (course.getMetadata() != null && !course.getMetadata().isEmpty()) {
            try {
                JsonNode jsonNode = objectMapper.readTree(course.getMetadata());
                if (jsonNode.has("description")) description = jsonNode.get("description").asText();
                if (jsonNode.has("thumbnailUrl")) thumbnailUrl = jsonNode.get("thumbnailUrl").asText();
                if (jsonNode.has("trailerUrl")) trailerUrl = jsonNode.get("trailerUrl").asText();
            } catch (Exception e) {
                // Ignore parse errors
            }
        }

        int courseTypeInt = (course.getPrice() != null && course.getPrice().compareTo(BigDecimal.ZERO) > 0) ? 1 : 0;
        CourseType courseTypeEnum = CourseType.values()[courseTypeInt];
        CourseStatus statusEnum = course.getStatus() != null ? course.getStatus() : CourseStatus.DRAFT;

        return CourseDetailDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(description)
                .level(course.getLevel() != null ? course.getLevel() : CourseLevel.BEGINNER)
                .courseType(courseTypeEnum)
                .basePrice(course.getPrice())
                .thumbnailUrl(thumbnailUrl)
                .trailerUrl(trailerUrl)
                .status(statusEnum)
                .createdById(null)
                .createdByName(null)
                .createdAt(course.getCreatedAt())
                .updatedAt(null)
                .lessons(lessonDTOs)
                .build();
    }

    public LessonDTO toLessonDTO(Lesson lesson) {
        if (lesson == null) {
            return null;
        }
        String contentUrl = null;
        String textContent = null;
        int durationSeconds = 0;

        if (lesson.getContent() != null && !lesson.getContent().isEmpty()) {
            try {
                JsonNode jsonNode = objectMapper.readTree(lesson.getContent());

                if (jsonNode.has("contentUrl")) {
                    contentUrl = jsonNode.get("contentUrl").asText();
                } else if (jsonNode.has("url")) {
                    contentUrl = jsonNode.get("url").asText();
                }

                if (jsonNode.has("textContent")) {
                    textContent = jsonNode.get("textContent").asText();
                }

                if (jsonNode.has("durationSeconds")) {
                    durationSeconds = jsonNode.get("durationSeconds").asInt();
                }
            } catch (Exception e) {
                // Ignore parse errors
            }
        }

        return LessonDTO.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse() != null ? lesson.getCourse().getId() : null)
                .title(lesson.getTitle())
                .contentType(lesson.getType() != null ? lesson.getType() : LessonContentType.VIDEO)
                .contentUrl(contentUrl)
                .textContent(textContent)
                .durationSeconds(durationSeconds)
                .orderIndex(lesson.getOrderIndex() != null ? lesson.getOrderIndex() : 0)
                .isPreview(lesson.getIsPreview() != null && lesson.getIsPreview())
                .createdAt(null)
                .updatedAt(null)
                .build();
    }
}