package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.request.Quiz.UserResultRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
import com.SWP.SkinCareService.dto.response.Skin.ResultResponse;
import com.SWP.SkinCareService.service.QuizService;
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
@RequestMapping("/quiz")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class QuizController {

    QuizService quizService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuizResponse>> createQuiz(@RequestBody @Valid QuizRequest request) {
        var result = quizService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<QuizResponse>builder()
                        .result(result)
                        .build()
                );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuizResponse>>> getAllQuiz() {
        var result = quizService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<QuizResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<ApiResponse<QuizResponse>> getQuizById(@PathVariable int quizId) {
        var result = quizService.getById(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuizResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{quizId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuizResponse>> updateQuiz(@PathVariable int quizId, @RequestBody @Valid QuizRequest request) {
        var result = quizService.update(quizId, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<QuizResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @DeleteMapping("/{quizId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteQuiz(@PathVariable int quizId) {
        quizService.delete(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Delete Successfully")
                        .build()
        );
    }
    
    @PostMapping("/result")
    public ResponseEntity<ApiResponse<ResultResponse>> getResult(@RequestBody UserResultRequest request) {
        var result = quizService.getResult(request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ResultResponse>builder().result(result).build()
        );
    }

    @PutMapping("/enable/{id}")
    public ResponseEntity<ApiResponse> enableQuiz(@PathVariable int id) {
        quizService.enable(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Enabled").build()
        );
    }

    @PutMapping("/disable/{id}")
    public ResponseEntity<ApiResponse> disableQuiz(@PathVariable int id) {
        quizService.disable(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Disabled").build()
        );
    }

}
