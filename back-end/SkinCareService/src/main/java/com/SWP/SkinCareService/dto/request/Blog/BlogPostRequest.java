package com.SWP.SkinCareService.dto.request.Blog;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Schema(description = "Blog post information")
public class BlogPostRequest {
    @Schema(
        description = "Blog category",
        example = "Skin Care",
        defaultValue = "Skin Care Tips"
    )
    @NotBlank(message = "Category cannot be empty")
    String category;

    @Schema(
        description = "Blog title",
        example = "10 Effective Ways to Take Care of Your Skin at Home",
        defaultValue = "How to Take Care of Your Skin"
    )
    @NotBlank(message = "Title cannot be empty")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    String title;

    @Schema(
        description = "Blog content",
        example = "1. Proper face washing\n2. Adequate moisturizing\n3. Daily sun protection...",
        defaultValue = "Detailed content about skin care methods..."
    )
    @NotBlank(message = "Content cannot be empty")
    String content;

    @Schema(
        description = "Therapist ID",
        example = "T123",
        defaultValue = "T123"
    )
    @NotBlank(message = "Therapist ID cannot be empty")
    String therapistID;

    @Schema(
        hidden = true
    )
    boolean approve;
}