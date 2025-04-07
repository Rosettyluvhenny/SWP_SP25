package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Integer> {
    /*
    @Query("SELECT q FROM QuizResult q WHERE q.id = :quizId ORDER BY q.rangePoint ASC")
    List<QuizResult> findByQuizIdOrdered(@Param("quizId") int quizId);

     */
    boolean existsByResultText(String resultText);
    boolean existsByName(String name);
}
