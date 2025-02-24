package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @PostMapping()
    public ResponseEntity<ApiResponse> createQuestion(@RequestBody QuestionRequest questionRequest) {
        return questionService.createQuestion(questionRequest);
    }

    @GetMapping()
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/{questionId}")
    public Question getQuestionById(@PathVariable int questionId) {
        return questionService.getQuestionById(questionId);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<ApiResponse> updateQuestion(@PathVariable int questionId, @RequestBody QuestionRequest questionRequest) {
        return questionService.updateQuestion(questionId, questionRequest);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse> deleteQuestion(@PathVariable int questionId) {
        return questionService.deleteQuestionById(questionId);
    }
}
