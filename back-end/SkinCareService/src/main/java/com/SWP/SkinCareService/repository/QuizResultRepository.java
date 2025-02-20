package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, String> {
}
