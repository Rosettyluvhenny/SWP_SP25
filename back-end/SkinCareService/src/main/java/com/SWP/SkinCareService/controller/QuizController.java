package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.quiz.QuizRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.quiz.QuizResponse;
import com.SWP.SkinCareService.service.QuizService;
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

    @PostMapping()
    ResponseEntity<ApiResponse<QuizResponse>> createQuiz(@RequestBody QuizRequest quizRequest) {
        var result = quizService.createQuiz(quizRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<QuizResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<QuizResponse>>> getAllQuiz() {
        var result = quizService.getAllQuiz();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuizResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{quizId}")
    ResponseEntity<ApiResponse<QuizResponse>> getQuizById(@PathVariable int quizId) {
        var result = quizService.getQuizById(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuizResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{quizId}")
    ResponseEntity<ApiResponse<QuizResponse>> updateQuiz(@PathVariable int quizId, @RequestBody QuizRequest quizRequest) {
        var result = quizService.updateQuiz(quizId, quizRequest);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuizResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{quizId}")
    ResponseEntity<ApiResponse> deleteQuiz(@PathVariable int quizId) {
        quizService.deleteQuiz(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Quiz deleted").build()
        );
    }

}
