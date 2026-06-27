package com.wms.controller;

import com.wms.dto.AssignmentReportDTO;
import com.wms.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/assignments/{lessonId}")
    public AssignmentReportDTO getAssignmentStatistics(@PathVariable UUID lessonId) {
        return reportService.getAssignmentStatistics(lessonId);
    }

    @GetMapping(value = "/assignments/{lessonId}/export", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> exportAssignmentExcel(@PathVariable UUID lessonId) {
        byte[] excelContent = reportService.exportAssignmentExcel(lessonId);

        HttpHeaders headers = new HttpHeaders();
        // Thiết lập header ép trình duyệt tải file xuống
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=assignment_report_" + lessonId + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelContent);
    }
}