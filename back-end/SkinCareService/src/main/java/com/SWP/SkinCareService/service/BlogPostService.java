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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
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
        
        QuizResult category = getCategoryById(request.getQuizResultId());
        
        BlogPost blogPost = blogPostMapper.toBlogPost(request);
        blogPost.setTherapist(therapist);
        blogPost.setQuizResult(category);
        
        // Save first to get the ID
        blogPostRepository.save(blogPost);
        
        // Handle image upload if present
        if (img != null && !img.isEmpty()) {
            String fileName = "blog_" + blogPost.getBlogId();
            try {
                String imgUrl = supabaseService.uploadImage(img, fileName);
                blogPost.setImg(imgUrl);
            } catch (IOException e) {
                throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
            }
        }

        return blogPostMapper.toBlogPostResponse(blogPost);
    }

    public Page<BlogPostResponse> getAllBlogPosts(boolean isApprove,Pageable pageable) {
        Page<BlogPost> result = isApprove? blogPostRepository.findAllByApproveTrue(pageable):blogPostRepository.findAll(pageable);
        return result.map(blogPostMapper::toBlogPostResponse);
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
            QuizResult category = getCategoryById(request.getQuizResultId());
            blogPost.setQuizResult(category);
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
                var imgurl = supabaseService.uploadImage(img, fileName);
                blogPost.setImg(imgurl);
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
        if(blogPost.isDefaultBlog())
            throw new AppException(ErrorCode.IS_DEFAULT_BLOG);
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
    @PreAuthorize("hasRole('ADMIN')")
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

    private QuizResult getCategoryById(Integer id) {
        return quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public BlogPostResponse setDefaultBlogPost(int blogPostId) {
        BlogPost blogPost = checkBlogPost(blogPostId);
        if(!blogPost.isApprove()){
            throw new AppException(ErrorCode.BLOGPOST_NOT_APPROVED);
        }
        if (blogPostRepository.existsByQuizResult_IdAndDefaultBlogTrue(blogPost.getQuizResult().getId())) {
            blogPostRepository.clearDefaultFlag(blogPost.getQuizResult().getId());
        }

        blogPost.setDefaultBlog(true);
        blogPostRepository.save(blogPost);
        return blogPostMapper.toBlogPostResponse(blogPost);
    }

    public BlogPostResponse getDefaultBlogPost(int quizResultId){
        BlogPost blog = blogPostRepository.findByQuizResult_IdAndDefaultBlogTrue(quizResultId).orElseThrow(()-> new AppException(ErrorCode.BLOGPOST_NOT_EXISTED));

        return blogPostMapper.toBlogPostResponse(blog);
    }

} 