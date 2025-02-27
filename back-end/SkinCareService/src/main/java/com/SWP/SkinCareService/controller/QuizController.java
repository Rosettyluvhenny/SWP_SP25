package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
import com.SWP.SkinCareService.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping
    public ResponseEntity<ApiResponse<QuizResponse>> createQuiz(@RequestBody @Valid QuizRequest request) {
        var result = quizService.createQuiz(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<QuizResponse>builder()
                        .result(result)
                        .build()
                );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuizResponse>>> getAllQuiz() {
        var result = quizService.getAllQuiz();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuizResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<ApiResponse<QuizResponse>> getQuizById(@PathVariable int quizId) {
        var result = quizService.getQuizById(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(
            ApiResponse.<QuizResponse>builder()
                    .result(result)
                    .build()
        );
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<ApiResponse<QuizResponse>> updateQuiz(@PathVariable int quizId, @RequestBody @Valid QuizRequest request) {
        var result = quizService.updateQuiz(quizId, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuizResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<ApiResponse> deleteQuiz(@PathVariable int quizId) {
        quizService.deleteQuiz(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Delete Successfully")
                        .build()
        );
    }

}
