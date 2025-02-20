package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.config.SupabaseConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import okhttp3.*;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    private final SupabaseConfig config;
    private final OkHttpClient client = new OkHttpClient();

    public SupabaseStorageService(SupabaseConfig config) {
        this.config = config;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        String url = config.getSupabaseUrl() + "/storage/v1/object/public/" + config.getBucketName() + "/" + fileName;

        RequestBody requestBody = RequestBody.create(file.getBytes(), MediaType.parse(file.getContentType()));
        Request request = new Request.Builder()
                .url(config.getSupabaseUrl() + "/storage/v1/object/" + config.getBucketName() + "/" + fileName)
                .header("Authorization", "Bearer " + config.getSupabaseKey())
                .header("Content-Type", "application/octet-stream")
                .put(requestBody)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                return url; // Trả về URL public của ảnh
            } else {
                throw new IOException("Upload failed: " + response.body().string());
            }
        }
    }

    public boolean deleteImage(String fileName) throws IOException {
        String url = config.getSupabaseUrl() + "/storage/v1/object/" + config.getBucketName() + "/" + fileName;

        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + config.getSupabaseKey())
                .delete()
                .build();

        try (Response response = client.newCall(request).execute()) {
            return response.isSuccessful();
        }
    }


    public String listFiles() throws IOException {
        String url = config.getSupabaseUrl() + "/storage/v1/object/list/" + config.getBucketName();

        // JSON body để lấy danh sách file (có thể chỉ định folder nếu cần)
        RequestBody requestBody = RequestBody.create(
                "{\"prefix\": \"\"}", // Để lấy toàn bộ file trong bucket
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + config.getSupabaseKey())
                .header("Content-Type", "application/json")
                .post(requestBody)  // Supabase yêu cầu POST thay vì GET
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                return response.body().string(); // Trả về danh sách file dưới dạng JSON
            } else {
                throw new IOException("Failed to fetch file list: " + response.message());
            }
        }
    }

}
