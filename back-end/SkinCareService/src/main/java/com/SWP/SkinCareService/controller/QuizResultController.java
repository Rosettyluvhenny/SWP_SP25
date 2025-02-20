package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.service.QuizResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quizResult")
public class QuizResultController {
    @Autowired
    private QuizResultService quizResultService;

    @PostMapping()
    public ResponseEntity<ApiResponse> addQuizResult(@RequestBody QuizResult request) {
        return quizResultService.createQuizResult(request);
    }

    @GetMapping()
    public List<QuizResult> getQuizResults() {
        return quizResultService.getAllQuizResults();
    }

    @GetMapping("/{quizResultId}")
    public QuizResult getQuizResult(@PathVariable int quizResultId) {
        return quizResultService.getQuizResultById(quizResultId);
    }

    @PutMapping("/{quizResultId}")
    public ResponseEntity<ApiResponse> updateQuizResult(@PathVariable int quizResultId, @RequestBody QuizResult request) {
        return quizResultService.updateQuizResult(quizResultId, request);
    }

    @DeleteMapping("/{quizResultId}")
    public ResponseEntity<ApiResponse> deleteQuizResult(@PathVariable int quizResultId) {
        return quizResultService.deleteQuizResult(quizResultId);
    }
}
