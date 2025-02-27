package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Quiz.AnswerRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Quiz.AnswerResponse;
import com.SWP.SkinCareService.service.AnswerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/answer")
public class AnswerController {
    @Autowired
    private AnswerService answerService;

    @PostMapping()
    public ResponseEntity<ApiResponse<AnswerResponse>> createAnswer(@RequestBody @Valid AnswerRequest request) {
        var result = answerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<AnswerResponse>builder()
                    .result(result)
                    .build()
        );
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<AnswerResponse>>> getAll() {
        var result = answerService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<AnswerResponse>>builder()
                        .result(result)
                        .build()
        );
    }


    @GetMapping("/{answerId}")
    public ResponseEntity<ApiResponse<AnswerResponse>> getById(@PathVariable int answerId) {
        var result = answerService.getById(answerId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<AnswerResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{questionId}/question")
    public ResponseEntity<ApiResponse<List<AnswerResponse>>> getByQuestionId(@PathVariable int questionId) {
        var result = answerService.getAllByQuestionId(questionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<AnswerResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{answerId}")
    public ResponseEntity<ApiResponse<AnswerResponse>> update(@PathVariable int answerId, @RequestBody @Valid AnswerRequest  request) {
        var result = answerService.update(answerId, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<AnswerResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @DeleteMapping("/{answerId}")
    public ResponseEntity<ApiResponse> deleteAnswer(@PathVariable int id) {
        answerService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Delete Successfully")
                        .build()
        );
    }


}
