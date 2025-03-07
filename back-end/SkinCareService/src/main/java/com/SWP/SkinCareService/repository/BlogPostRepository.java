package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Integer> {
} 