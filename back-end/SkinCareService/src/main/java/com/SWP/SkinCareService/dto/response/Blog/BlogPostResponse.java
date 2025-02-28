package com.SWP.SkinCareService.dto.response.Blog;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogPostResponse {
    Integer blogID;
    String category;
    String title;
    String content;
    String therapistName;
    boolean isApprove;
    String img;
}