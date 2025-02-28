package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogPostRepository extends JpaRepository<BlogPost, Integer> {
}