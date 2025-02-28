package com.SWP.SkinCareService.dto.request.Blog;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogPostRequest {
    String category;
    String title;
    String content;
    String therapistID;
    boolean isApprove;
    String img;
}