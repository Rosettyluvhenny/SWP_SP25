package com.SWP.SkinCareService.config;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupabaseConfig {
    @Value("${supabase.url}")
    private String url;

    @Value("${supabase.bucket}")
    private String bucket;

    @Value("${supabase.key}")
    private String key;
}
