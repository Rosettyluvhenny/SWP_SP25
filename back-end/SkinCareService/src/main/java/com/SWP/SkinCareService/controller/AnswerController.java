package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.quiz.AnswerRequest;
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
    public ResponseEntity<ApiResponse> createAnswer(@RequestBody AnswerRequest answerRequest) {
        return answerService.createAnswer(answerRequest);
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
    public ResponseEntity<ApiResponse> updateAnswer(@PathVariable int answerId, @RequestBody AnswerRequest  answerRequest) {
        return answerService.updateAnswer(answerId, answerRequest);
    }

    @DeleteMapping("/{answerId}")
    public ResponseEntity<ApiResponse> deleteAnswer(@PathVariable int answerId) {
        return answerService.deleteAnswer(answerId);
    }


}
