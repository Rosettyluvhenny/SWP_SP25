package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.quiz.AnswerRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.quiz.AnswerResponse;
import com.SWP.SkinCareService.entity.Answer;
import com.SWP.SkinCareService.service.AnswerService;
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
    ResponseEntity<ApiResponse<AnswerResponse>> createAnswer(@RequestBody AnswerRequest answerRequest) {
        var result = answerService.createAnswer(answerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AnswerResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<AnswerResponse>>> getAllAnswers() {
        var result = answerService.getAllAnswers();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<AnswerResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{answerId}")
    ResponseEntity<ApiResponse<AnswerResponse>> getAnswerById(@PathVariable int answerId) {
        var result = answerService.getAnswerById(answerId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<AnswerResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{answerId}")
    ResponseEntity<ApiResponse<AnswerResponse>> updateAnswer(@PathVariable int answerId, @RequestBody AnswerRequest  answerRequest) {
        var result = answerService.updateAnswer(answerId, answerRequest);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<AnswerResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{answerId}")
    ResponseEntity<ApiResponse> deleteAnswer(@PathVariable int answerId) {
        answerService.deleteAnswer(answerId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Answer deleted").build()
        );
    }
}
