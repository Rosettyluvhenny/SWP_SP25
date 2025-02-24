package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.service.SupabaseStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/supabase")
public class SupabaseApi {

    private final SupabaseStorageService storageService;

    public SupabaseApi(SupabaseStorageService storageService) {
        this.storageService = storageService;
    }

    // 📌 API Upload file lên Supabase
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = storageService.uploadImage(file);
            return ResponseEntity.ok(fileUrl); // Trả về URL public của ảnh
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + e.getMessage());
        }
    }

    // 📌 API Xóa file khỏi Supabase
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFile(@RequestParam("fileName") String fileName) {
        try {
            boolean isDeleted = storageService.deleteImage(fileName);
            return isDeleted ? ResponseEntity.ok("File deleted successfully: " + fileName)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found: " + fileName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting file: " + e.getMessage());
        }
    }

    // 📌 API Lấy danh sách file trong Supabase
    @GetMapping("/list")
    public ResponseEntity<String> listFiles() {
        try {
            return ResponseEntity.ok(storageService.listFiles());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch file list: " + e.getMessage());
        }
    }
}
