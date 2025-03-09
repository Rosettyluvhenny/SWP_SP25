package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.SWP.SkinCareService.entity.Answer;
import java.util.List;
@Repository
public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    List<Answer> findAllByQuestion(Question question);

    boolean existsByText(String text);
}

