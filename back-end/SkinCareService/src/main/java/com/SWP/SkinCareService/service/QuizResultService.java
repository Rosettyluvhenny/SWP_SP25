package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Quiz.QuizResultRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResultResponse;
import com.SWP.SkinCareService.dto.response.basicDTO.ServiceDTO;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.User;
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
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class QuizResultService {

    private QuizResultRepository quizResultRepository;

    private ServicesRepository servicesRepository;

    private QuizRepository quizRepository;

    private QuizResultMapper quizResultMapper;

    private SupabaseService supabaseService;

    @Transactional
    public QuizResultResponse createQuizResult(QuizResultRequest request) {
        //Check result existed
        if (quizResultRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.RESULT_EXISTED);
        }
        //Check quiz
        Quiz quiz = getQuizById(request.getQuizId());
        QuizResult quizResult = quizResultMapper.toQuizResult(request);
        quizResult.setQuiz(quiz);
        quizResultRepository.save(quizResult);
        //Add service
        if (request.getServiceId() != null) {
            List<Integer> serviceIds = new ArrayList<>(request.getServiceId());
            List<Services> servicesList = new ArrayList<>(servicesRepository.findAllById(serviceIds));
            if (servicesList.size() != serviceIds.size()) {
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            }
            for (Services service : servicesList) {
                service.getQuizResults().add(quizResult);
                servicesRepository.save(service);
            }
            quizResult.setServices(servicesList);
        }

        //return response;
        return quizResultMapper.toQuizResultResponse(quizResult);
    }

    public List<QuizResultResponse> getAllQuizResults() {
        return quizResultRepository.findAll().stream().map(quizResultMapper::toQuizResultResponse).toList();
    }

    public QuizResultResponse getQuizResultById(int id) {
        QuizResult quizResult = quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.RESULT_NOT_EXISTED));
        return quizResultMapper.toQuizResultResponse(quizResult);
    }

    @Transactional
    public QuizResultResponse updateQuizResult(int id, QuizResultRequest request) {
        //Check result existed or not
        QuizResult quizResult = checkQuizResult(id);
        quizResultMapper.updateQuizResult(quizResult, request);

        if (quizResult.getQuiz().isStatus()) {
            throw new AppException(ErrorCode.QUIZ_IS_ACTIVE);
        }

        //Check quiz existed or not
        Quiz newQuiz = getQuizById(request.getQuizId());
        quizResult.setQuiz(newQuiz);
        System.out.println(request.getServiceId());
        //Clear the existed service

        List<Services> servicesExisted = quizResult.getServices();
        for (Services service : servicesExisted) {
            service.getQuizResults().remove(quizResult);
            servicesRepository.save(service);
        }

        quizResult.getServices().clear();
        //Update service
        if (request.getServiceId() != null) {
            List<Integer> serviceIds = new ArrayList<>(request.getServiceId());
            List<Services> servicesList = new ArrayList<>(servicesRepository.findAllById(serviceIds));
            if (servicesList.size() != serviceIds.size()) {
                throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
            }
            for (Services service : servicesList) {
                service.getQuizResults().add(quizResult);
                servicesRepository.save(service);
            }
            quizResult.setServices(servicesList);
        }
        quizResultRepository.save(quizResult);

        return quizResultMapper.toQuizResultResponse(quizResult);
    }

    @Transactional
    public void deleteQuizResult(int id) {
        QuizResult quizResult = checkQuizResult(id);

        if (quizResult.getQuiz().isStatus()) {
            throw new AppException(ErrorCode.QUIZ_IS_ACTIVE);
        }

        // Clear references from users
        for (User user : quizResult.getUsers()) {
            user.setQuizResult(null);
        }

        // Clear references from services
        for (Services service : quizResult.getServices()) {
            service.getQuizResults().remove(quizResult);
        }

        // Clear lists to avoid any potential issues
        quizResult.getUsers().clear();
        quizResult.getServices().clear();

        quizResultRepository.delete(quizResult);
    }

    private QuizResult checkQuizResult(int id) {
        return quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.RESULT_NOT_EXISTED));
    }

    private Services getServiceById(int id) {
        return servicesRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }

    private Quiz getQuizById(int id) {
        return quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }

    public List<QuizResult> getQuizResultsByQuizId(int quizId) {
        List<QuizResult> list = new ArrayList<>();
        for (QuizResult result : quizResultRepository.findAll()) {
            if (result.getQuiz().getId() == quizId) {
                list.add(result);
            }
        }
        return list;
    }

}
