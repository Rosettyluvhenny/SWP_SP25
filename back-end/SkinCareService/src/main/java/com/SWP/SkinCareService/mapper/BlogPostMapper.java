package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Blog.BlogPostRequest;
import com.SWP.SkinCareService.dto.response.Blog.BlogPostResponse;
import com.SWP.SkinCareService.entity.BlogPost;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BlogPostMapper {
    @Mapping(target = "therapist", ignore = true)
    @Mapping(target = "img", ignore = true)
    BlogPost toBlogPost(BlogPostRequest request);

    @Mapping(target = "blogId", ignore = true)
    @Mapping(target = "therapist", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "img", ignore = true)
    void updateBlogPost(@MappingTarget BlogPost blogPost, BlogPostRequest request);

    @Mapping(source = "blogId", target = "blogId")
    @Mapping(source = "therapist.user.fullName", target = "therapistName")
    BlogPostResponse toBlogPostResponse(BlogPost blogPost);
}