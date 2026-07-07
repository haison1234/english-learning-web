package com.wms.controller;

import com.wms.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    @Autowired
    private FileStorageService storageService;

    // 1. API Upload file
    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        String filename = storageService.saveFile(file);
        return ResponseEntity.ok(filename);
    }

    // 2. API Stream/Serve file
    @GetMapping("/serve/{filename}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws IOException {
        // Lấy đường dẫn thư mục uploads tuyệt đối để tránh lỗi 400
        Path rootLocation = Paths.get("./uploads").toAbsolutePath().normalize();
        Path filePath = rootLocation.resolve(filename).normalize();

        // Bảo mật: Kiểm tra để tránh truy cập ngoài thư mục uploads
        if (!filePath.startsWith(rootLocation)) {
            return ResponseEntity.badRequest().build();
        }

        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        // Tự động nhận diện kiểu file
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}