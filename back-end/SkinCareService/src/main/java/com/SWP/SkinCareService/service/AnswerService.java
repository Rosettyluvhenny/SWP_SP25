package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.QuestionRepository;
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
    private QuestionRepository questionRepository;
    @Autowired
    private AnswerRepository answerRepository;

    public void createAnswer(AnswerCreateRequest answerCreateRequest) {
        Answer answer = new Answer();

        int questionId = answerCreateRequest.getQuestionId();
        Question question = questionRepository.findById(Integer.toString(questionId)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));

        answer.setQuestion(question);
        answer.setAnswerText(answerCreateRequest.getAnswerText());
        answer.setCreatedAt(answerCreateRequest.getCreatedAt());
        answer.setPoint(answerCreateRequest.getPoint());
        answerRepository.save(answer);
    }

    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }

    public Answer getAnswerById(int answerId) {
        return answerRepository.findById(Integer.toString(answerId)).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED));
    }

    @Transactional
    public void updateAnswer(int answerId, AnswerUpdateRequest answerUpdateRequest) {
        Answer answer = answerRepository.findById(Integer.toString(answerId)).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED));

        int questionId = answerUpdateRequest.getQuestionId();
        Question question = questionRepository.findById(Integer.toString(questionId)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));

        answer.setQuestion(question);
        answer.setAnswerText(answerUpdateRequest.getAnswerText());
        answer.setPoint(answerUpdateRequest.getPoint());
        answerRepository.save(answer);

    }

    public void deleteAnswer(int answerId) {
        answerRepository.deleteById(Integer.toString(answerId));
    }
}
