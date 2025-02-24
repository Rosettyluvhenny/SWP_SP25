package com.SWP.SkinCareService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.SWP.SkinCareService.entity.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question,Integer> {
}
