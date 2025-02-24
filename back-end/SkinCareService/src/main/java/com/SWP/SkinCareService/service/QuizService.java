package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.quiz.QuizResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.QuizMapper;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.repository.QuizRepository;
import com.SWP.SkinCareService.dto.request.quiz.QuizRequest;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class QuizService {

    private ServiceCategoryRepository serviceCategoryRepository;

    private QuizRepository quizRepositories;

    private QuizMapper quizMapper;

    @Transactional
    public QuizResponse createQuiz(QuizRequest request) {
        //Check service existed or not
        int serviceCategoryId = request.getServiceCategoryId();
        ServiceCategory serviceCategory = getServiceCategoryById(serviceCategoryId);
        //Create
        Quiz quiz = quizMapper.toQuiz(request);
        quiz.setServiceCategory(serviceCategory);
        quizRepositories.save(quiz);

        return quizMapper.toQuizResponse(quiz);
    }

    public List<QuizResponse> getAllQuiz() {
        return quizRepositories.findAll().stream().map(quizMapper::toQuizResponse).toList();
    }

    public QuizResponse getQuizById(int id) {
        return quizMapper.toQuizResponse(quizRepositories.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED)));
    }

    @Transactional
    public QuizResponse updateQuiz(int id, QuizRequest request) {
        //Check quiz existed or not
        Quiz quiz = checkQuiz(id);
        //Check service existed or not
        int serviceCategoryId = request.getServiceCategoryId();
        ServiceCategory serviceCategory = getServiceCategoryById(serviceCategoryId);
        //Update
        quizMapper.updateQuiz(quiz, request);
        quiz.setServiceCategory(serviceCategory);
        quizRepositories.save(quiz);

        return quizMapper.toQuizResponse(quiz);
    }

    public void deleteQuiz(int id) {
        //Check quiz existed or not
        Quiz quiz = checkQuiz(id);
        quizRepositories.delete(quiz);
    }

    private ServiceCategory getServiceCategoryById(int id) {
        return serviceCategoryRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }

    private Quiz checkQuiz(int id) {
        return quizRepositories.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }
}
