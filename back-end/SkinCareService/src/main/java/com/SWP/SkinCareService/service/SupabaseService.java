package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.config.SupabaseConfig;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
public class SupabaseService {
    private final OkHttpClient client = new OkHttpClient();
    private final SupabaseConfig supabaseConfig;

    public SupabaseService(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }
    public String uploadImage(MultipartFile multipartFile, String fileName) throws IOException {
        if (multipartFile.isEmpty()) {
            throw new IOException("Uploaded file is empty");
        }

        RequestBody fileBody = RequestBody.create(
                multipartFile.getBytes(), // Convert MultipartFile to byte array
                MediaType.parse(multipartFile.getContentType()) // Use actual file type
        );

        MultipartBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", fileName, fileBody)
                .build();

        Request request = new Request.Builder()
                .url(supabaseConfig.getUrl() + "/storage/v1/object/" + supabaseConfig.getBucket() + "/" + fileName)
                .header("Authorization", "Bearer " + supabaseConfig.getKey())
                .header("Content-Type", "multipart/form-data")
                .post(requestBody)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to upload image: " + response.body().string());
            }
            return supabaseConfig.getUrl() + "/storage/v1/object/public/" + supabaseConfig.getBucket() + "//" + fileName;
        }
    }

    public boolean deleteImage(String fileName) throws IOException {
        String urlReference = supabaseConfig.getUrl() + "/storage/v1/object/public/" + supabaseConfig.getBucket();
        String deleteUrl = "";
        if (fileName.contains(urlReference)) {
            deleteUrl = fileName.replaceFirst(urlReference,"");
        } else {
            deleteUrl = fileName;
        }
        System.out.println(deleteUrl);
        Request request = new Request.Builder()
                .url(supabaseConfig.getUrl() + "/storage/v1/object/" + supabaseConfig.getBucket()+ deleteUrl)
                .header("Authorization", "Bearer " + supabaseConfig.getKey())
                .delete()
                .build();



        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException(response.message()+" "+response.body().string());
            }
            return true;
        }
    }
    public String getImage(String fileName) {
        String imageUrl = supabaseConfig.getUrl() + "/storage/v1/object/public/"
                + supabaseConfig.getBucket() + "/" + fileName;

        // Send a HEAD request to check if the image exists
        Request request = new Request.Builder()
                .url(imageUrl)
                .head()// Only checks if the file exists, without downloading it
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                return imageUrl;  // File exists, return the URL
            } else {
                log.info("Image not exis " + fileName);
                throw new IOException("Image not exist");
            }
        }catch (IOException e){
            return supabaseConfig.getUrl() + "/storage/v1/object/public/"
                    + supabaseConfig.getBucket() + "/" +"Default";
        }
    }
}

