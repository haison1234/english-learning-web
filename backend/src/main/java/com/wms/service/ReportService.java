package com.wms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wms.dto.AssignmentReportDTO;
import com.wms.dto.StudentScoreDTO;
import com.wms.entity.Enrollment;
import com.wms.entity.Lesson;
import com.wms.exception.ResourceNotFoundException;
import com.wms.repository.EnrollmentRepository;
import com.wms.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ObjectMapper objectMapper;

    // 1. Tính toán thống kê và trả về JSON cho Chart
    public AssignmentReportDTO getAssignmentStatistics(UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài tập"));

        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(lesson.getCourse().getId());

        List<StudentScoreDTO> studentScores = new ArrayList<>();
        double totalScore = 0.0;
        int countScored = 0;

        // Khởi tạo map phân phối điểm
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("0-2", 0);
        distribution.put("2-4", 0);
        distribution.put("4-6", 0);
        distribution.put("6-8", 0);
        distribution.put("8-10", 0);

        for (Enrollment enrollment : enrollments) {
            StudentScoreDTO dto = extractScoreFromJson(enrollment, lessonId.toString());
            studentScores.add(dto);

            if (dto.getScore() != null) {
                double score = dto.getScore();
                totalScore += score;
                countScored++;

                // Phân loại vào biểu đồ
                if (score < 2) distribution.put("0-2", distribution.get("0-2") + 1);
                else if (score < 4) distribution.put("2-4", distribution.get("2-4") + 1);
                else if (score < 6) distribution.put("4-6", distribution.get("4-6") + 1);
                else if (score < 8) distribution.put("6-8", distribution.get("6-8") + 1);
                else distribution.put("8-10", distribution.get("8-10") + 1);
            }
        }

        double average = countScored > 0 ? (totalScore / countScored) : 0.0;

        return AssignmentReportDTO.builder()
                .lessonTitle(lesson.getTitle())
                .averageScore(Math.round(average * 100.0) / 100.0)
                .distribution(distribution)
                .studentScores(studentScores)
                .build();
    }

    // 2. Xuất file Excel
    public byte[] exportAssignmentExcel(UUID lessonId) {
        AssignmentReportDTO report = getAssignmentStatistics(lessonId);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Ket Qua Bai Tap");

            // Tạo Header
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID Học sinh", "Họ và tên", "Email", "Trạng thái", "Điểm số"};

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Đổ dữ liệu
            int rowIdx = 1;
            for (StudentScoreDTO student : report.getStudentScores()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(student.getUserId().toString());
                row.createCell(1).setCellValue(student.getFullName());
                row.createCell(2).setCellValue(student.getEmail());
                row.createCell(3).setCellValue(student.getIsCompleted() ? "Đã nộp" : "Chưa nộp");

                if (student.getScore() != null) {
                    row.createCell(4).setCellValue(student.getScore());
                } else {
                    row.createCell(4).setCellValue("N/A");
                }
            }

            // Tự động căn chỉnh độ rộng cột
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Lỗi khi tạo file Excel", e);
            throw new RuntimeException("Không thể tạo file báo cáo");
        }
    }

    private StudentScoreDTO extractScoreFromJson(Enrollment enrollment, String lessonIdStr) {
        Double score = null;
        Boolean isCompleted = false;

        if (enrollment.getProgressData() != null && !enrollment.getProgressData().isEmpty()) {
            try {
                JsonNode rootNode = objectMapper.readTree(enrollment.getProgressData());

                JsonNode lessonNode = rootNode.get(lessonIdStr.toLowerCase());
                if (lessonNode == null) {
                    lessonNode = rootNode.get(lessonIdStr.toUpperCase());
                }

                if (lessonNode != null) {
                    if (lessonNode.has("completed")) {
                        isCompleted = lessonNode.get("completed").asBoolean();
                    }
                    if (lessonNode.has("score")) {
                        score = lessonNode.get("score").asDouble();
                    }
                }
            } catch (Exception e) {
                log.warn("Lỗi parse progressData cho Enrollment ID: " + enrollment.getId());
            }
        }

        return StudentScoreDTO.builder()
                .userId(enrollment.getUser().getId())
                .fullName(enrollment.getUser().getFullName())
                .email(enrollment.getUser().getEmail())
                .score(score)
                .isCompleted(isCompleted)
                .build();
    }
}