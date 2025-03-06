package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.request.Quiz.UserResultRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
import com.SWP.SkinCareService.dto.response.Quiz.ResultResponse;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.QuizMapper;
import com.SWP.SkinCareService.mapper.QuizResultMapper;
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
    QuizResultService quizResultService;
    QuizResultMapper quizResultMapper;

    @Transactional
    public QuizResponse create(QuizRequest request) {
        //Check category
        ServiceCategory serviceCategory = getCategory(request.getServiceCategoryId());
        List<Quiz> quizList= serviceCategory.getQuiz();
        //Check quiz existed by category or not
        for (Quiz quiz : quizList) {
            if (quiz.getName().equals(request.getName())) {
                throw new AppException(ErrorCode.QUIZ_EXISTED);
            }
        }
        //Convert
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
        quizRepository.delete(quiz);
    }
    private Quiz getQuiz(int id) {
        return quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }
    private ServiceCategory getCategory(int id){
        return serviceCategoryRepository.findById(id).
                orElseThrow(()-> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
    }

    public ResultResponse getResult(UserResultRequest request){
        int quizId = request.getQuizId();

        int score = request.getScore();
        QuizResult skinType = null;

        for (QuizResult result : quizResultService.getQuizResultsByQuizId(quizId)) {
            if ((result.getMinPoint() <= score) && (score <= result.getMaxPoint())) {
                skinType = result;
            }
        }
        if (skinType == null) {
            throw new AppException(ErrorCode.RESULT_NOT_EXISTED);
        }

        return quizResultMapper.toResultResponse(skinType);
    }

}
