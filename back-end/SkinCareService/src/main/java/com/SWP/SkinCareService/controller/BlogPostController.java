package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Blog.BlogPostRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Blog.BlogPostResponse;
import com.SWP.SkinCareService.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/blogpost")
public class BlogPostController {
    @Autowired
    private BlogPostService blogPostService;

    @PostMapping()
    ResponseEntity<ApiResponse<BlogPostResponse>> createBlogPost(@RequestBody BlogPostRequest blogPostRequest) {
        var result = blogPostService.createBlogPost(blogPostRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<BlogPostResponse>builder().result(result).build()
        );
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

    @PutMapping("/{blogPostId}")
    ResponseEntity<ApiResponse<BlogPostResponse>> updateBlogPost(@PathVariable Integer blogPostId, @RequestBody BlogPostRequest blogPostRequest) {
        var result = blogPostService.updateBlogPost(blogPostId, blogPostRequest);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BlogPostResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{blogPostId}")
    public ResponseEntity<ApiResponse> deleteBlogPost(@PathVariable Integer blogPostId) {
        blogPostService.deleteBlogPost(blogPostId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Blog post deleted").build()
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