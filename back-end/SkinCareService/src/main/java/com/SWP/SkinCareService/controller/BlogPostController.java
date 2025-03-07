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
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @PutMapping(value = "/{blogPostId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BlogPostResponse>> updateBlogPost(
            @PathVariable Integer blogPostId,
            @RequestPart("data") @Valid BlogPostRequest request,
            @RequestPart(value = "img", required = false) MultipartFile img) throws IOException {

        // Kiểm tra dung lượng file nếu có


        var result = blogPostService.updateBlogPost(blogPostId, request, img);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BlogPostResponse>builder()
                        .code(200)
                        .result(result)
                        .message("Blog post updated successfully")
                        .build()
        );
    }

    @Operation(summary = "Delete a blog post", description = "Delete a blog post by ID")
    @DeleteMapping("/{blogPostId}")
    public ResponseEntity<ApiResponse<Void>> deleteBlogPost(@PathVariable Integer blogPostId) {
        var response = blogPostService.deleteBlogPost(blogPostId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Approve a blog post", description = "Approve a blog post by ID")
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
}
