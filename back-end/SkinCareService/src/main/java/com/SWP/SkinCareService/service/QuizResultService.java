package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.quiz.QuizResultRequest;
import com.SWP.SkinCareService.dto.response.quiz.QuizResultResponse;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.QuizResultMapper;
import com.SWP.SkinCareService.repository.QuizRepository;
import com.SWP.SkinCareService.repository.QuizResultRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class QuizResultService {

    private QuizResultRepository quizResultRepository;

    private ServicesRepository servicesRepository;

    private QuizRepository quizRepository;

    private QuizResultMapper quizResultMapper;

    @Transactional
    public QuizResultResponse createQuizResult(QuizResultRequest request) {
        QuizResult quizResult = quizResultMapper.toQuizResult(request);
        quizResult = quizResultRepository.save(quizResult);

        Services service = getServiceById(request.getServiceId());
        Quiz quiz = getQuizById(request.getQuizId());

        service.getQuizResults().add(quizResult);

        if (quizResult.getServices() == null) {
            quizResult.setServices(new ArrayList<>());
        }

        quizResult.setQuiz(quiz);

        quizResult.getServices().add(service);

        servicesRepository.save(service);
        quizResultRepository.save(quizResult);
        return quizResultMapper.toQuizResultResponse(quizResult);
    }

    public List<QuizResultResponse> getAllQuizResults() {
        return quizResultRepository.findAll().stream().map(quizResultMapper::toQuizResultResponse).toList();
    }

    public QuizResultResponse getQuizResultById(int id) {
        return quizResultMapper.toQuizResultResponse(quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.RESULT_NOT_EXISTED) ));
    }

    @Transactional
    public QuizResultResponse updateQuizResult(int id, QuizResultRequest request) {
        //Check result existed or not
        QuizResult quizResult = checkQuizResult(id);
        Services newService = getServiceById(request.getServiceId());

        Quiz newQuiz = getQuizById(request.getQuizId());

        for (Services oldService : quizResult.getServices()) {
            oldService.getQuizResults().remove(quizResult);
            servicesRepository.save(oldService);
        }

        newService.getQuizResults().add(quizResult);
        quizResult.getServices().clear();
        quizResult.getServices().add(newService);

        quizResultMapper.updateQuizResult(quizResult, request);
        quizResult.setQuiz(newQuiz);

        servicesRepository.save(newService);
        quizResultRepository.save(quizResult);
        return quizResultMapper.toQuizResultResponse(quizResult);
    }

    public void deleteQuizResult(int id) {
        //Check result existed or not
        QuizResult quizResult = checkQuizResult(id);
        quizResultRepository.delete(quizResult);
    }

    private QuizResult checkQuizResult(int id) {
        return quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.RESULT_NOT_EXISTED));
    }

    private Services getServiceById(int id) {
        return servicesRepository.findById((long) id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }

    private Quiz getQuizById(int id) {
        return quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }

    public String getQuizResult(Long quizId, int score) {

        List<QuizResult> results = quizResultRepository.findByQuizIdOrdered(quizId);

        int lowerBound = 0;
        for (QuizResult result : results) {
            if (score >= lowerBound && score <= result.getRangePoint()) {
                return result.getResultText();
            }

            lowerBound = result.getRangePoint() + 1;
        }
        return results.getLast().getResultText();
    }

}
