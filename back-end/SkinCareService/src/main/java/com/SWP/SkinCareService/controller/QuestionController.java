package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.quiz.QuestionResponse;
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
    ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(@RequestBody QuestionRequest questionRequest) {
        var result = questionService.createQuestion(questionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<QuestionResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<QuestionResponse>>> getAllQuestions() {
        var result = questionService.getAllQuestions();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuestionResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{questionId}")
    ResponseEntity<ApiResponse<QuestionResponse>> getQuestionById(@PathVariable int questionId) {
        var result = questionService.getQuestionById(questionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuestionResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{questionId}")
    ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(@PathVariable int questionId, @RequestBody QuestionRequest questionRequest) {
        var result = questionService.updateQuestion(questionId, questionRequest);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuestionResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse> deleteQuestion(@PathVariable int questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Question deleted").build()
        );
    }
}
