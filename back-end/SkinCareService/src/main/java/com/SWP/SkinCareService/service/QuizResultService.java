package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.quiz.QuizResultRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizResultService {
    @Autowired
    private QuizResultRepository quizResultRepository;

    public ResponseEntity<ApiResponse> createQuizResult(QuizResultRequest request) {
        QuizResult quizResult = new QuizResult();
        quizResult.setResultText(request.getResultText());
        quizResult.setRangePoint(request.getRangePoint());
        quizResultRepository.save(quizResult);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.CREATED.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Result created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    public List<QuizResult> getAllQuizResults() {
        return quizResultRepository.findAll();
    }

    public QuizResult getQuizResultById(int id) {
        return quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.RESULT_NOT_EXISTED));
    }

    public ResponseEntity<ApiResponse> updateQuizResult(int id, QuizResultRequest request) {
        //Check result existed or not
        QuizResult quizResult = quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.RESULT_NOT_EXISTED));
        //Update
        quizResult.setResultText(request.getResultText());
        quizResult.setRangePoint(request.getRangePoint());
        quizResultRepository.save(quizResult);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Result updated successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    public ResponseEntity<ApiResponse> deleteQuizResult(int id) {
        //Check result existed or not
        QuizResult quizResult = quizResultRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.RESULT_NOT_EXISTED));
        quizResultRepository.deleteById(id);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Result deleted successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
