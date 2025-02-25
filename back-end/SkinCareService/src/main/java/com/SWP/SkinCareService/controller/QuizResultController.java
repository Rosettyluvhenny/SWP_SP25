package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.quiz.QuizResultRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.quiz.QuizResultResponse;
import com.SWP.SkinCareService.service.QuizResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quizResult")
public class QuizResultController {
    @Autowired
    private QuizResultService quizResultService;

    @PostMapping()
    ResponseEntity<ApiResponse<QuizResultResponse>> addQuizResult(@RequestBody QuizResultRequest request) {
        var result = quizResultService.createQuizResult(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<QuizResultResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<QuizResultResponse>>> getQuizResults() {
        var result = quizResultService.getAllQuizResults();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuizResultResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{quizResultId}")
    ResponseEntity<ApiResponse<QuizResultResponse>> getQuizResult(@PathVariable int quizResultId) {
        var result = quizResultService.getQuizResultById(quizResultId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuizResultResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{quizResultId}")
    ResponseEntity<ApiResponse<QuizResultResponse>> updateQuizResult(@PathVariable int quizResultId, @RequestBody QuizResultRequest request) {
        var result = quizResultService.updateQuizResult(quizResultId, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuizResultResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{quizResultId}")
    public ResponseEntity<ApiResponse> deleteQuizResult(@PathVariable int quizResultId) {
        quizResultService.deleteQuizResult(quizResultId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Result deleted").build()
        );
    }
}
