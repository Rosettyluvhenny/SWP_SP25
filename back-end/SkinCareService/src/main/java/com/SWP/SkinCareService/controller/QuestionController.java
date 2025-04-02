package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Quiz.QuestionResponse;
import com.SWP.SkinCareService.service.QuestionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class QuestionController {
    QuestionService questionService;

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(@RequestBody @Valid QuestionRequest questionCreateRequest) {
        var result = questionService.create(questionCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<QuestionResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<QuestionResponse>>> getAllQuestions() {
        var result = questionService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuestionResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuestionResponse>> getByQuestionId(@PathVariable int id) {
        var result =  questionService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuestionResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{quizId}/quizzes")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getByQuizId(@PathVariable int quizId) {
        var result = questionService.getByQuizId(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuestionResponse>>builder()
                        .result(result)
                        .build()
        );
    }


    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(@PathVariable int questionId, @RequestBody @Valid QuestionRequest request) {
        var result = questionService.update(questionId, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuestionResponse>builder()
                        .result(result)
                        .build());
    }

    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteQuestion(@PathVariable int questionId) {
        questionService.delete(questionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuestionResponse>builder()
                        .message("Delete successfully")
                        .build()
        );
    }
}
