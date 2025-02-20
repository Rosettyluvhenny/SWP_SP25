package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.QuizRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping()
    public ResponseEntity<ApiResponse> createQuiz(@RequestBody QuizRequest quizRequest) {
        return quizService.createQuiz(quizRequest);
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
    public ResponseEntity<ApiResponse> updateQuiz(@PathVariable int quizId, @RequestBody QuizRequest quizRequest) {
        return quizService.updateQuiz(quizId, quizRequest);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<ApiResponse> deleteQuiz(@PathVariable int quizId) {
        return quizService.deleteQuiz(quizId);
    }

}
