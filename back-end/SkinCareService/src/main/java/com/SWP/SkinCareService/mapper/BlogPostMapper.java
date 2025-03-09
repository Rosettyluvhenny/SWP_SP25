package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Blog.BlogPostRequest;
import com.SWP.SkinCareService.dto.response.Blog.BlogPostResponse;
import com.SWP.SkinCareService.entity.BlogPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BlogPostMapper {
    @Mapping(target = "blogId", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "therapist", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "img", ignore = true)
    BlogPost toBlogPost(BlogPostRequest request);

    void updateBlogPost(@MappingTarget BlogPost blogPost, BlogPostRequest request);

    @Mapping(source = "therapist.user.fullName", target = "therapistName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    BlogPostResponse toBlogPostResponse(BlogPost blogPost);
} 