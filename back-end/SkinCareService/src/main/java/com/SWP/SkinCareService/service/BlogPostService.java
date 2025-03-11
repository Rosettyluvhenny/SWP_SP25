package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Blog.BlogPostRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Blog.BlogPostResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BlogPostMapper;
import com.SWP.SkinCareService.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
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
    UserRepository userRepository;
    BlogPostMapper blogPostMapper;
    SupabaseService supabaseService;
    QuizResultRepository quizResultRepository;

    @Transactional
    public BlogPostResponse createBlogPost(BlogPostRequest request, MultipartFile img) throws IOException {
        // Lấy thông tin user hiện tại từ SecurityContextHolder
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Lấy username từ authentication
        
        // Tìm user theo username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Lấy therapist từ user ID
        Therapist therapist = therapistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
        
        QuizResult quizResult = getQuizResultById(request.getQuizResultId());
        
        BlogPost blogPost = blogPostMapper.toBlogPost(request);
        blogPost.setTherapist(therapist);
        blogPost.setQuizResult(quizResult);
        
        // Save first to get the ID
        blogPostRepository.save(blogPost);
        
        // Handle image upload if present
        if (img != null && !img.isEmpty()) {
            String fileName = "blog_" + blogPost.getBlogId();
            try {
                supabaseService.uploadImage(img, fileName);
                blogPost.setImg(fileName);
            } catch (IOException e) {
                throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
            }
        }
        
        return blogPostMapper.toBlogPostResponse(blogPost);
    }

    public Page<BlogPostResponse> getAllBlogPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable).map(blogPostMapper::toBlogPostResponse);
    }

    public BlogPostResponse getBlogPostById(Integer id) {
        return blogPostMapper.toBlogPostResponse(checkBlogPost(id));
    }

    @Transactional
    public BlogPostResponse updateBlogPost(Integer id, BlogPostRequest request, MultipartFile img) throws IOException {
        BlogPost blogPost = checkBlogPost(id);
        
        // Kiểm tra xem người đang đăng nhập có phải là therapist của blog này không
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Tìm user theo username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Lấy therapist từ user ID
        Therapist currentTherapist = therapistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
                
        if (!blogPost.getTherapist().getId().equals(currentTherapist.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        if (request.getQuizResultId() != null) {
            QuizResult result = getQuizResultById(request.getQuizResultId());
            blogPost.setQuizResult(result);
        }

        blogPostMapper.updateBlogPost(blogPost, request);
        
        // Handle image update if present
        if (img != null && !img.isEmpty()) {
            String fileName = "blog_" + blogPost.getBlogId();
            
            // Try to delete old image if exists
            if (blogPost.getImg() != null) {
                try {
                    supabaseService.deleteImage("blog_" + blogPost.getBlogId());
                } catch (IOException e) {
                    // Ignore if image doesn't exist
                }
            }
            
            try {
                // Upload new image and save the filename
                supabaseService.uploadImage(img, fileName);
                blogPost.setImg(fileName);
            } catch (IOException e) {
                throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
            }
        }

        blogPostRepository.save(blogPost);
        return blogPostMapper.toBlogPostResponse(blogPost);
    }

    @Transactional
    public ApiResponse<Void> deleteBlogPost(Integer id) {
        BlogPost blogPost = checkBlogPost(id);
        
        // Kiểm tra xem người đang đăng nhập có phải là therapist của blog này không
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Tìm user theo username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Lấy therapist từ user ID
        Therapist currentTherapist = therapistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
                
        if (!blogPost.getTherapist().getId().equals(currentTherapist.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
        
        // Delete image from Supabase if exists
        if (blogPost.getImg() != null) {
            try {
                supabaseService.deleteImage("blog_" + blogPost.getBlogId());
            } catch (IOException e) {
                // Continue with blog post deletion even if image deletion fails
            }
        }
        
        blogPostRepository.delete(blogPost);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Blog post deleted successfully")
                .build();
    }

    @Transactional
    public BlogPostResponse approveBlogPost(Integer id) {
        BlogPost blogPost = checkBlogPost(id);
        
        if (blogPost.isApprove()) {
            throw new AppException(ErrorCode.BLOGPOST_ALREADY_APPROVED);
        }
        
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

    private QuizResult getQuizResultById(Integer id) {
        return quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.RESULT_NOT_EXISTED));
    }
} 