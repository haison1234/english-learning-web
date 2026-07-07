package com.wms.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserHistoryDTO {
    private String fullName;
    private String email;
    private List<CourseProgress> enrolledCourses;

    @Data
    @Builder
    public static class CourseProgress {
        private String courseTitle;
        private LocalDateTime enrolledAt;
        private Integer paymentStatus;
        private Object progressDetails;
    }
}