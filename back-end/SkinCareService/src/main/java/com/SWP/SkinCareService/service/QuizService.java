package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
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
import com.SWP.SkinCareService.entity.ServiceCategory;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class QuizService {
    QuizRepository quizRepository;
    QuizMapper quizMapper;
    ServiceCategoryRepository serviceCategoryRepository;

    @Transactional
    public QuizResponse create(QuizRequest request) {
        ServiceCategory serviceCategory = getCategory(request.getServiceCategoryId());
        Quiz quiz = quizMapper.toQuiz(request);
        quiz.setServiceCategory(serviceCategory);
        quizRepository.save(quiz);
        return quizMapper.toResponse(quiz);
    }


    public List<QuizResponse> getAll() {
        var quiz = quizRepository.findAll().stream().map(quizMapper::toResponse).toList();
        return quiz;
    }

    public QuizResponse getById(int id) {
        return quizMapper.toResponse(getQuiz(id));
    }

    @Transactional
    public QuizResponse update(int id, QuizRequest request) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        quizMapper.updateQuiz(request,quiz);
        int serviceCategoryId = request.getServiceCategoryId();
        ServiceCategory serviceCategory = getCategory(serviceCategoryId);
        quiz.setServiceCategory(serviceCategory);
        quizRepository.save(quiz);
        return quizMapper.toResponse(quiz);
    }

    public void delete(int id) {
        Quiz quiz = getQuiz(id);
        quizRepository.deleteById(id);
    }
    private Quiz getQuiz(int id) {
        return quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }
    private ServiceCategory getCategory(int id){
        return serviceCategoryRepository.findById(id).
                orElseThrow(()-> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
    }
}
