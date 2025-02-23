package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.QuizMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.repository.QuizRepository;

import java.util.List;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuizMapper quizMapper;

    @Transactional
    public QuizResponse createQuiz(QuizRequest request) {
        Quiz quiz = quizMapper.toQuiz(request);
        quizRepository.save(quiz);
        return quizMapper.toQuizResponse(quiz);
    }

    public List<QuizResponse> getAllQuiz() {
        var quiz = quizRepository.findAll().stream().map(quizMapper::toQuizResponse).toList();
        return quiz;

    }

    public QuizResponse getQuizById(int id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        return quizMapper.toQuizResponse(quiz);
    }

    @Transactional
    public QuizResponse updateQuiz(int id, QuizRequest request) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        quizMapper.updateQuiz(request,quiz);
        quizRepository.save(quiz);
        return quizMapper.toQuizResponse(quiz);
    }

    public void deleteQuiz(int id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));

        quizRepository.deleteById(id);
    }

}
