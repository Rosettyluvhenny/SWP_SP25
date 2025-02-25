package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.quiz.QuizResultRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.quiz.QuizResultResponse;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.entity.ServiceList;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.QuizResultMapper;
import com.SWP.SkinCareService.repository.QuizResultRepository;
import com.SWP.SkinCareService.repository.ServiceListRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class QuizResultService {

    private QuizResultRepository quizResultRepository;

    private ServiceListRepository serviceListRepository;

    private QuizResultMapper quizResultMapper;

    @Transactional
    public QuizResultResponse createQuizResult(QuizResultRequest request) {
        QuizResult quizResult = quizResultMapper.toQuizResult(request);
        quizResult = quizResultRepository.save(quizResult);

        ServiceList serviceList = getServiceListById(request.getServiceId());

        serviceList.getQuizResults().add(quizResult);

        if (quizResult.getServices() == null) {
            quizResult.setServices(new ArrayList<>());
        }
        quizResult.getServices().add(serviceList);

        serviceListRepository.save(serviceList);
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
        ServiceList newService = getServiceListById(request.getServiceId());

        for (ServiceList oldService : quizResult.getServices()) {
            oldService.getQuizResults().remove(quizResult);
            serviceListRepository.save(oldService);
        }

        newService.getQuizResults().add(quizResult);
        quizResult.getServices().clear();
        quizResult.getServices().add(newService);

        quizResultMapper.updateQuizResult(quizResult, request);
        serviceListRepository.save(newService);
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

    private ServiceList getServiceListById(int id) {
        return serviceListRepository.findById((long) id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }
}
