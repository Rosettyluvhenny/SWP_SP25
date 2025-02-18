package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.repository.QuizRepository;
import com.SWP.SkinCareService.dto.request.QuizCreateRequest;
import com.SWP.SkinCareService.dto.request.QuizUpdateRequest;

import java.util.List;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepositories;

    public void createQuiz(QuizCreateRequest request) {
        Quiz quiz = new Quiz();
        quiz.setServiceCategoryId(request.getServiceCategoryId());
        quizRepositories.save(quiz);
    }

    public List<Quiz> getAllQuiz() {
        return quizRepositories.findAll();
    }

    public Quiz getQuizById(int id) {
        return quizRepositories.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }

    @Transactional
    public void updateQuiz(int id, QuizUpdateRequest request) {
        Quiz quiz = quizRepositories.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        quiz.setServiceCategoryId(request.getServiceCategoryId());
        quizRepositories.save(quiz);
    }

    public void deleteQuiz(int id) {
        quizRepositories.deleteById(Integer.toString(id));
    }

}
