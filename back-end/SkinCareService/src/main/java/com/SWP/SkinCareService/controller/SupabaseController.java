package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.service.SupabaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/supabase")
@RequiredArgsConstructor
public class SupabaseController {

    private final SupabaseService supabaseService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename(); // Unique filename
            String imageUrl = supabaseService.uploadImage(file, fileName);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to upload image: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<String> deleteImage(@PathVariable String fileName) {
        try {
            boolean isDeleted = supabaseService.deleteImage(fileName);
            if (isDeleted) {
                return ResponseEntity.ok("Image deleted successfully.");
            } else {
                return ResponseEntity.badRequest().body("Failed to delete image.");
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error deleting image: " + e.getMessage());
        }
    }
}
