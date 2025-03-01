package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Blog.BlogPostRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Blog.BlogPostResponse;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.service.BlogPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/blogpost")
public class BlogPostController {
    @Autowired
    private BlogPostService blogPostService;

    @Operation(
        summary = "Create a new blog post",
        description = """
            Create a new blog post with optional image. Fill in each field with appropriate information.
            
            Example form data:
            - category: Skin Care Tips
            - title: How to Take Care of Your Skin
            - content: Detailed content about skin care methods...
            - therapistID: T123
            - img: (file upload)
            """
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ApiResponse<BlogPostResponse>> createBlogPost(
            @Parameter(hidden = true)
            @ModelAttribute @Valid BlogPostRequest blogData,
            
            @RequestParam @NotBlank(message = "Category cannot be empty")
            @Parameter(description = "Blog category", example = "Skin Care Tips") 
            String category,
            
            @RequestParam @NotBlank(message = "Title cannot be empty")
            @Parameter(description = "Blog title", example = "How to Take Care of Your Skin") 
            String title,
            
            @RequestParam @NotBlank(message = "Content cannot be empty")
            @Parameter(description = "Blog content", example = "Detailed content about skin care methods...") 
            String content,
            
            @RequestParam @NotBlank(message = "Therapist ID cannot be empty")
            @Parameter(description = "Therapist ID", example = "T123") 
            String therapistID,
            
            @RequestParam(value = "img", required = false)
            @Parameter(description = "Blog image file (optional)") 
            MultipartFile img) {
        try {
            blogData = BlogPostRequest.builder()
                .category(category)
                .title(title)
                .content(content)
                .therapistID(therapistID)
                .approve(false)
                .build();
            var result = blogPostService.createBlogPost(blogData, img);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponse.<BlogPostResponse>builder().result(result).build()
            );
        } catch (IOException e) {
            throw new AppException(ErrorCode.IO_EXCEPTION);
        }
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<BlogPostResponse>>> getAllBlogPosts() {
        var result = blogPostService.getAllBlogPosts();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<BlogPostResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{blogPostId}")
    ResponseEntity<ApiResponse<BlogPostResponse>> getBlogPostById(@PathVariable Integer blogPostId) {
        var result = blogPostService.getBlogPostById(blogPostId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BlogPostResponse>builder().result(result).build()
        );
    }

    @Operation(
        summary = "Update a blog post",
        description = """
            Update an existing blog post with optional image. Fill in each field with appropriate information.
            
            Example form data:
            - category: Skin Care Tips
            - title: How to Take Care of Your Skin
            - content: Detailed content about skin care methods...
            - therapistID: T123
            - img: (file upload)
            """
    )
    @PutMapping(value = "/{blogPostId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ApiResponse<BlogPostResponse>> updateBlogPost(
            @PathVariable Integer blogPostId,
            
            @Parameter(hidden = true)
            @ModelAttribute @Valid BlogPostRequest blogData,
            
            @RequestParam @NotBlank(message = "Category cannot be empty")
            @Parameter(description = "Blog category", example = "Skin Care Tips") 
            String category,
            
            @RequestParam @NotBlank(message = "Title cannot be empty")
            @Parameter(description = "Blog title", example = "How to Take Care of Your Skin") 
            String title,
            
            @RequestParam @NotBlank(message = "Content cannot be empty")
            @Parameter(description = "Blog content", example = "Detailed content about skin care methods...") 
            String content,
            
            @RequestParam @NotBlank(message = "Therapist ID cannot be empty")
            @Parameter(description = "Therapist ID", example = "T123") 
            String therapistID,
            
            @RequestParam(value = "img", required = false)
            @Parameter(description = "Blog image file (optional)")
            MultipartFile img) {
        try {
            blogData = BlogPostRequest.builder()
                .category(category)
                .title(title)
                .content(content)
                .therapistID(therapistID)
                .approve(false)
                .build();
            var result = blogPostService.updateBlogPost(blogPostId, blogData, img);
            return ResponseEntity.status(HttpStatus.OK).body(
                    ApiResponse.<BlogPostResponse>builder().result(result).build()
            );
        } catch (IOException e) {
            throw new AppException(ErrorCode.IO_EXCEPTION);
        }
    }

    @DeleteMapping("/{blogPostId}")
    public ResponseEntity<ApiResponse> deleteBlogPost(@PathVariable Integer blogPostId) {
        blogPostService.deleteBlogPost(blogPostId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Blog post deleted successfully").build()
        );
    }

    @PutMapping("/approve/{id}")
    ResponseEntity<ApiResponse<BlogPostResponse>> approveBlogPost(@PathVariable Integer id) {
        var result = blogPostService.approveBlogPost(id);
        return ResponseEntity.ok(
                ApiResponse.<BlogPostResponse>builder().result(result).build()
        );
    }
}