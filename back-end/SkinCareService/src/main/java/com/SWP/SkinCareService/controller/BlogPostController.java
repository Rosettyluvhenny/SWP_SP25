package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Blog.BlogPostRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Blog.BlogPostResponse;
import com.SWP.SkinCareService.service.BlogPostService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/blogpost")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogPostController {
    BlogPostService blogPostService;

    @Operation(summary = "Create a new blog post", description = "Create a new blog post with optional image")
    @PreAuthorize("hasRole('THERAPIST')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BlogPostResponse>> createBlogPost(
            @RequestPart("data") @Valid BlogPostRequest request,
            @RequestPart(value = "img", required = false) MultipartFile img) throws IOException {

        // Kiểm tra dung lượng file nếu có


        var result = blogPostService.createBlogPost(request, img);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<BlogPostResponse>builder()
                        .code(201)
                        .result(result)
                        .message("Blog post created successfully")
                        .build()
        );
    }

    @Operation(summary = "Update a blog post", description = "Update a blog post by ID")
    @PreAuthorize("hasRole('THERAPIST') and @customSecurityService.canEditBlogPost(#blogPostId, authentication.name)")
    @PutMapping(value = "/{blogPostId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BlogPostResponse>> updateBlogPost(
            @PathVariable Integer blogPostId,
            @RequestPart("data") @Valid BlogPostRequest request,
            @RequestPart(value = "img", required = false) MultipartFile img) throws IOException {

        // Kiểm tra dung lượng file nếu có


        var result = blogPostService.updateBlogPost(blogPostId, request, img);
        return ResponseEntity.ok(
                ApiResponse.<BlogPostResponse>builder()
                        .code(200)
                        .result(result)
                        .message("Blog post updated successfully")
                        .build()
        );
    }

    @Operation(summary = "Delete a blog post", description = "Delete a blog post by ID")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{blogPostId}")
    public ResponseEntity<ApiResponse<Void>> deleteBlogPost(@PathVariable Integer blogPostId) {
        var response = blogPostService.deleteBlogPost(blogPostId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Approve a blog post", description = "Approve a blog post by ID")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> approveBlogPost(@PathVariable Integer id) {
        var result = blogPostService.approveBlogPost(id);
        return ResponseEntity.ok(
                ApiResponse.<BlogPostResponse>builder()
                        .code(200)
                        .result(result)
                        .message("Blog post approved successfully")
                        .build()
        );
    }

    @Operation(summary = "Get all blog posts", description = "Get all blog posts")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BlogPostResponse>>> getAllBlogPosts(@RequestParam(required = false, defaultValue = "true") boolean isApprove, Pageable pageable) {
        var result = blogPostService.getAllBlogPosts(isApprove, pageable);
        return ResponseEntity.ok(
                ApiResponse.<Page<BlogPostResponse>>builder()
                        .code(200)
                        .result(result)
                        .message("Blog posts retrieved successfully")
                        .build()
        );
    }

    @Operation(summary = "Get blog post by ID", description = "Get blog post by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> getBlogPostById(@PathVariable Integer id) {
        var result = blogPostService.getBlogPostById(id);
        return ResponseEntity.ok(
                ApiResponse.<BlogPostResponse>builder()
                        .code(200)
                        .result(result)
                        .message("Blog post retrieved successfully")
                        .build()
        );
    }

    @GetMapping("/default/{quizResultId}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> getDefault(@PathVariable Integer quizResultId) {
        var result = blogPostService.getDefaultBlogPost(quizResultId);
        return ResponseEntity.ok(
                ApiResponse.<BlogPostResponse>builder()
                        .code(200)
                        .result(result)
                        .message("Blog post retrieved successfully")
                        .build()
        );
    }

    @PutMapping("/default/{id}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> setDefaultBlog(@PathVariable Integer id) {
        var result = blogPostService.setDefaultBlogPost(id);
        return ResponseEntity.ok(
                ApiResponse.<BlogPostResponse>builder()
                        .code(200)
                        .result(result)
                        .message("Blog post retrieved successfully")
                        .build()
        );
    }
}
