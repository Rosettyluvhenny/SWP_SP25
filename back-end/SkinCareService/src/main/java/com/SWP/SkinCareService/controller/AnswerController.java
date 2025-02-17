package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.AnswerCreateRequest;
import com.SWP.SkinCareService.dto.request.AnswerUpdateRequest;
import com.SWP.SkinCareService.entity.Answer;
import com.SWP.SkinCareService.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/answer")
public class AnswerController {
    @Autowired
    private AnswerService answerService;

    @PostMapping()
    public void createAnswer(@RequestBody AnswerCreateRequest answerCreateRequest) {
        answerService.createAnswer(answerCreateRequest);
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
    public void updateAnswer(@PathVariable int answerId, @RequestBody AnswerUpdateRequest  answerUpdateRequest) {
        answerService.updateAnswer(answerId, answerUpdateRequest);
    }

    @DeleteMapping("/{answerId}")
    public void deleteAnswer(@PathVariable int answerId) {
        answerService.deleteAnswer(answerId);
    }


}
