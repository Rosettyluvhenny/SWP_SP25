package com.SWP.SkinCareService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Answer;

import com.SWP.SkinCareService.repository.AnswerRepository;
import com.SWP.SkinCareService.dto.request.AnswerCreateRequest;
import com.SWP.SkinCareService.dto.request.AnswerUpdateRequest;

import java.util.List;

@Service
public class AnswerService {
    @Autowired
    private QuestionService questionService;
    @Autowired
    private AnswerRepository answerRepository;

    public void createAnswer(AnswerCreateRequest answerCreateRequest) {
        Answer answer = new Answer();
        answer.setQuestion(questionService.getQuestionById(answerCreateRequest.getQuestionId()));
        answer.setAnswerText(answerCreateRequest.getAnswerText());
        answer.setCreatedAt(answerCreateRequest.getCreatedAt());
        answer.setPoint(answerCreateRequest.getPoint());
        answerRepository.save(answer);
    }

    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }

    public Answer getAnswerById(int answerId) {
        return answerRepository.findById(Integer.toString(answerId)).orElseThrow(() -> new RuntimeException("Answer not found"));
    }

    @Transactional
    public void updateAnswer(int answerId, AnswerUpdateRequest answerUpdateRequest) {
        Answer answer = getAnswerById(answerId);
        answer.setQuestion(questionService.getQuestionById(answerUpdateRequest.getQuestionId()));
        answer.setAnswerText(answerUpdateRequest.getAnswerText());
        answer.setPoint(answerUpdateRequest.getPoint());
        answerRepository.save(answer);

    }

    public void deleteAnswer(int answerId) {
        answerRepository.deleteById(Integer.toString(answerId));
    }
}
