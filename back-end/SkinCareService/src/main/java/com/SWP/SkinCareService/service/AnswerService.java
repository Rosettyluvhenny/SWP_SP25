package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.quiz.AnswerResponse;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.AnswerMapper;
import com.SWP.SkinCareService.repository.QuestionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Answer;

import com.SWP.SkinCareService.repository.AnswerRepository;
import com.SWP.SkinCareService.dto.request.quiz.AnswerRequest;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AnswerService {

    private QuestionRepository questionRepository;

    private AnswerRepository answerRepository;

    private AnswerMapper answerMapper;

    @Transactional
    public AnswerResponse createAnswer(AnswerRequest answerRequest) {
        //Check question existed or not
        int questionId = answerRequest.getQuestionId();
        Question question = getQuestionById(questionId);
        //Create
        Answer answer = answerMapper.toAnswer(answerRequest);
        answer.setQuestion(question);
        answerRepository.save(answer);

        return answerMapper.toAnswerResponse(answer);
    }

    public List<AnswerResponse> getAllAnswers() {
        return answerRepository.findAll().stream().map(answerMapper::toAnswerResponse).toList();
    }

    public AnswerResponse getAnswerById(int answerId) {
        return answerMapper.toAnswerResponse(answerRepository.findById(answerId).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED)));
    }

    @Transactional
    public AnswerResponse updateAnswer(int answerId, AnswerRequest answerRequest) {
        //Check answer existed or not
        Answer answer = checkAnswer(answerId);
        //Check question existed or not
        int questionId = answerRequest.getQuestionId();
        Question question = getQuestionById(questionId);
        //Update
        answerMapper.updateAnswer(answer, answerRequest);
        answer.setQuestion(question);
        answerRepository.save(answer);

        return answerMapper.toAnswerResponse(answer);
    }

    public void deleteAnswer(int answerId) {
        //Check answer existed or not
        Answer answer = checkAnswer(answerId);
        answerRepository.delete(answer);
    }

    private Question getQuestionById(int questionId) {
        return questionRepository.findById(questionId).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
    }

    private Answer checkAnswer(int id) {
        return answerRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED));
    }
}
