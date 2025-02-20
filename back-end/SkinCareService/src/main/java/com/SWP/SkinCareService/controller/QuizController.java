package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Quiz.QuizCreateRequest;
import com.SWP.SkinCareService.dto.request.Quiz.QuizUpdateRequest;
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
    public ResponseEntity<ApiResponse> createQuiz(@RequestBody QuizCreateRequest quizCreateRequest) {
        return quizService.createQuiz(quizCreateRequest);
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
    public ResponseEntity<ApiResponse> updateQuiz(@PathVariable int quizId, @RequestBody QuizUpdateRequest quizUpdateRequest) {
        return quizService.updateQuiz(quizId, quizUpdateRequest);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<ApiResponse> deleteQuiz(@PathVariable int quizId) {
        return quizService.deleteQuiz(quizId);
    }

}
