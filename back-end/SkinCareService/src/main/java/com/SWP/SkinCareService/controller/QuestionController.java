package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Quiz.QuestionResponse;
import com.SWP.SkinCareService.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @PostMapping()
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(@RequestBody QuestionRequest questionCreateRequest) {
        var result = questionService.create(questionCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<QuestionResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getAll() {
        var result = questionService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuestionResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> getById(@PathVariable int id) {
        var result =  questionService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuestionResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{quizId}/Quizzes")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getByQuizId(@PathVariable int quizId) {
        var result =  questionService.getByQuizId(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuestionResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(@PathVariable int questionId, @RequestBody QuestionRequest request) {
        var result = questionService.update(questionId, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuestionResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse> deleteQuestion(@PathVariable int questionId) {
        questionService.deleteQuestionById(questionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuestionResponse>builder()
                        .message("Delete successfully")
                        .build()
        );
    }
}
