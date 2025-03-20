package com.SWP.SkinCareService.dto.response.Blog;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogPostResponse {
    Integer blogId;
    Integer categoryId;
    String categoryName;
    String title;
    String content;
    String therapistName;
    boolean approve;
    String img;
    boolean defaultBlog;
} 