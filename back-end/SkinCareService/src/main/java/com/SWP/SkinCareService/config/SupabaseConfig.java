package com.SWP.SkinCareService.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SupabaseConfig {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    public String getUrl() {
        return supabaseUrl;
    }

    public String getKey() {
        return supabaseKey;
    }

    public String getBucket() {
        return bucketName;
    }
}

