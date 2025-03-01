package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Blog.BlogPostRequest;
import com.SWP.SkinCareService.dto.response.Blog.BlogPostResponse;
import com.SWP.SkinCareService.entity.BlogPost;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BlogPostMapper;
import com.SWP.SkinCareService.repository.BlogPostRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BlogPostService {
    BlogPostRepository blogPostRepository;
    TherapistRepository therapistRepository;
    BlogPostMapper blogPostMapper;
    SupabaseService supabaseService;
    ObjectMapper objectMapper;

    @Transactional
    public BlogPostResponse createBlogPost(BlogPostRequest request, MultipartFile img) throws IOException {
        Therapist therapist = getTherapistById(request.getTherapistID());
        BlogPost blogPost = blogPostMapper.toBlogPost(request);
        blogPost.setTherapist(therapist);
        
        // Save first to get the ID
        blogPostRepository.save(blogPost);
        
        // Handle image upload if present
        if (img != null && !img.isEmpty()) {
            String fileName = "blog_" + blogPost.getBlogId();
            String imgUrl = supabaseService.uploadImage(img, fileName);
            blogPost.setImg(imgUrl);
        }
        
        return blogPostMapper.toBlogPostResponse(blogPost);
    }

    public List<BlogPostResponse> getAllBlogPosts() {
        return blogPostRepository.findAll().stream()
                .map(blogPostMapper::toBlogPostResponse)
                .toList();
    }

    public BlogPostResponse getBlogPostById(Integer id) {
        return blogPostMapper.toBlogPostResponse(checkBlogPost(id));
    }

    @Transactional
    public BlogPostResponse updateBlogPost(Integer id, BlogPostRequest request, MultipartFile img) throws IOException {
        BlogPost blogPost = checkBlogPost(id);

        if (request.getTherapistID() != null) {
            Therapist therapist = getTherapistById(request.getTherapistID());
            blogPost.setTherapist(therapist);
        }

        blogPostMapper.updateBlogPost(blogPost, request);
        
        // Handle image update if present
        if (img != null && !img.isEmpty()) {
            String fileName = "blog_" + blogPost.getBlogId();
            String imgUrl = supabaseService.uploadImage(img, fileName);
            blogPost.setImg(imgUrl);
        }

        return blogPostMapper.toBlogPostResponse(blogPost);
    }

    @Transactional
    public void deleteBlogPost(Integer id) {
        BlogPost blogPost = checkBlogPost(id);
        blogPostRepository.delete(blogPost);
    }

    @Transactional
    public BlogPostResponse approveBlogPost(Integer id) {
        BlogPost blogPost = checkBlogPost(id);
        blogPost.setApprove(true);
        blogPostRepository.save(blogPost);
        return blogPostMapper.toBlogPostResponse(blogPost);
    }

    private BlogPost checkBlogPost(Integer id) {
        return blogPostRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.BLOGPOST_NOT_EXISTED));
    }

    private Therapist getTherapistById(String id) {
        return therapistRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }
}