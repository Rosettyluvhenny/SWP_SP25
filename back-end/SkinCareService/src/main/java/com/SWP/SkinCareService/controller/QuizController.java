package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.QuizCreateRequest;
import com.SWP.SkinCareService.dto.request.QuizUpdateRequest;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping()
    public void createQuiz(@RequestBody QuizCreateRequest quizCreateRequest) {
        quizService.createQuiz(quizCreateRequest);
    }

    @GetMapping()
    public List<Quiz> getAllQuiz() {
        return quizService.getAllQuiz();
    }

    @GetMapping("/{quizId}")
    public Quiz getQuizById(@PathVariable int quizId) {
        return quizService.getQuizById(quizId);
    }

    @PutMapping("/{quizId}")
    public void updateQuiz(@PathVariable int quizId, @RequestBody QuizUpdateRequest quizUpdateRequest) {
        quizService.updateQuiz(quizId, quizUpdateRequest);
    }

    @DeleteMapping("/{quizId}")
    public void deleteQuiz(@PathVariable int quizId) {
        quizService.deleteQuiz(quizId);
    }

}
