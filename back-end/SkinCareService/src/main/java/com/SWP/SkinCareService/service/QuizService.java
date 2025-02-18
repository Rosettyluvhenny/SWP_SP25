package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    public ResponseEntity<ApiResponse> createQuiz(QuizCreateRequest request) {
        Quiz quiz = new Quiz();
        quiz.setServiceCategoryId(request.getServiceCategoryId());
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
    public ResponseEntity<ApiResponse> updateQuiz(int id, QuizUpdateRequest request) {
        Quiz quiz = quizRepositories.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        quiz.setServiceCategoryId(request.getServiceCategoryId());
        quizRepositories.save(quiz);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Successfully updated Quiz");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    public ResponseEntity<ApiResponse> deleteQuiz(int id) {
        quizRepositories.deleteById(Integer.toString(id));
        //Response to client
        ApiResponse apiResponse = new ApiResponse<>();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Successfully deleted Quiz");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

}
