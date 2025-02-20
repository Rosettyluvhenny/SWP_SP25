package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Quiz.AnswerCreateRequest;
import com.SWP.SkinCareService.dto.request.Quiz.AnswerUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.Answer;
import com.SWP.SkinCareService.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/answer")
public class AnswerController {
    @Autowired
    private AnswerService answerService;

    @PostMapping()
    public ResponseEntity<ApiResponse> createAnswer(@RequestBody AnswerCreateRequest answerCreateRequest) {
        return answerService.createAnswer(answerCreateRequest);
    }

    @GetMapping()
    public List<Answer> getAllAnswers() {
        return answerService.getAllAnswers();
    }

    @GetMapping("/{answerId}")
    public Answer getAnswerById(@PathVariable int answerId) {
        return answerService.getAnswerById(answerId);
    }

    @PutMapping("/{answerId}")
    public ResponseEntity<ApiResponse> updateAnswer(@PathVariable int answerId, @RequestBody AnswerUpdateRequest  answerUpdateRequest) {
        return answerService.updateAnswer(answerId, answerUpdateRequest);
    }

    @DeleteMapping("/{answerId}")
    public ResponseEntity<ApiResponse> deleteAnswer(@PathVariable int answerId) {
        return answerService.deleteAnswer(answerId);
    }


}
