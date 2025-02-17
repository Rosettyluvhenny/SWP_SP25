package com.SWP.SkinCareService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.SWP.SkinCareService.entity.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, String> {
}

