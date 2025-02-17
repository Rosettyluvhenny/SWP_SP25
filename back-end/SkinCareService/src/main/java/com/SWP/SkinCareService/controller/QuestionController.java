package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.QuestionCreateRequest;
import com.SWP.SkinCareService.dto.request.QuestionUpdateRequest;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @PostMapping()
    public void createQuestion(@RequestBody QuestionCreateRequest questionCreateRequest) {
        questionService.createQuestion(questionCreateRequest);
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
    public void updateQuestion(@PathVariable int questionId, @RequestBody QuestionUpdateRequest questionUpdateRequest) {
        questionService.updateQuestion(questionId, questionUpdateRequest);
    }

    @DeleteMapping("/{questionId}")
    public void deleteQuestion(@PathVariable int questionId) {
        questionService.deleteQuestionById(questionId);
    }
}
