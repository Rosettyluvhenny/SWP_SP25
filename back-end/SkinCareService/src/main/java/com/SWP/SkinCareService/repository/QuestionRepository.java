package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.SWP.SkinCareService.entity.Question;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question,Integer> {
    List<Question> findByQuiz(Quiz quiz);
}
