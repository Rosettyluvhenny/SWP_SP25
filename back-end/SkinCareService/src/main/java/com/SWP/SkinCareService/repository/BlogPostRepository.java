package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Integer> {
    Page<BlogPost> findAll(Pageable pageable);
    @Modifying
    @Query("UPDATE BlogPost b SET b.defaultBlog = false WHERE b.defaultBlog = true AND b.quizResult.id = :quizResultId")
    void clearDefaultFlag(@Param("quizResultId") int quizResultId);
    Optional<BlogPost> findByDefaultBlogTrue();
    Page<BlogPost> findAllByApproveTrue(Pageable pageable);

    boolean existsByDefaultBlogTrue();
    boolean existsByQuizResult_IdAndDefaultBlogTrue(int quizResultId);
    Optional<BlogPost> findByQuizResult_IdAndDefaultBlogTrue(int quizResultId);
}