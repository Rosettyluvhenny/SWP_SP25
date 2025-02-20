package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.repository.QuizRepository;
import com.SWP.SkinCareService.dto.request.QuizRequest;

import java.util.List;

@Service
public class QuizService {
    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    @Autowired
    private QuizRepository quizRepositories;

    public ResponseEntity<ApiResponse> createQuiz(QuizRequest request) {
        Quiz quiz = new Quiz();
        //Check service existed or not
        int serviceCategoryId = request.getServiceCategoryId();
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(Integer.toString(serviceCategoryId)).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        //Create
        quiz.setServiceCategory(serviceCategory);
        quiz.setQuizName(request.getQuizName());
        quizRepositories.save(quiz);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.CREATED.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Successfully created Quiz");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    public List<Quiz> getAllQuiz() {
        return quizRepositories.findAll();
    }

    public Quiz getQuizById(int id) {
        return quizRepositories.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }

    @Transactional
    public ResponseEntity<ApiResponse> updateQuiz(int id, QuizRequest request) {
        //Check quiz existed or not
        Quiz quiz = quizRepositories.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        //Check service existed or not
        int serviceCategoryId = request.getServiceCategoryId();
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(Integer.toString(serviceCategoryId)).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        //Update
        quiz.setServiceCategory(serviceCategory);
        quiz.setQuizName(request.getQuizName());
        quizRepositories.save(quiz);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Successfully updated Quiz");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    public ResponseEntity<ApiResponse> deleteQuiz(int id) {
        //Check quiz existed or not
        Quiz quiz = quizRepositories.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        quizRepositories.deleteById(Integer.toString(id));
        //Response to client
        ApiResponse apiResponse = new ApiResponse<>();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Successfully deleted Quiz");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

}
