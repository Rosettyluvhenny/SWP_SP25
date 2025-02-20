package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Answer;

import com.SWP.SkinCareService.repository.AnswerRepository;
import com.SWP.SkinCareService.dto.request.AnswerRequest;

import java.util.List;

@Service
public class AnswerService {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private AnswerRepository answerRepository;

    public ResponseEntity<ApiResponse> createAnswer(AnswerRequest answerRequest) {
        Answer answer = new Answer();
        //Check question existed or not
        int questionId = answerRequest.getQuestionId();
        Question question = questionRepository.findById(Integer.toString(questionId)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
        //Create
        answer.setQuestion(question);
        answer.setAnswerText(answerRequest.getAnswerText());
        answer.setPoint(answerRequest.getPoint());
        answerRepository.save(answer);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.CREATED.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Answer created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }

    public Answer getAnswerById(int answerId) {
        return answerRepository.findById(Integer.toString(answerId)).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED));
    }

    @Transactional
    public ResponseEntity<ApiResponse> updateAnswer(int answerId, AnswerRequest answerRequest) {
        //Check answer existed or not
        Answer answer = answerRepository.findById(Integer.toString(answerId)).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED));
        //Check question existed or not
        int questionId = answerRequest.getQuestionId();
        Question question = questionRepository.findById(Integer.toString(questionId)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
        //Update
        answer.setQuestion(question);
        answer.setAnswerText(answerRequest.getAnswerText());
        answer.setPoint(answerRequest.getPoint());
        answerRepository.save(answer);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Answer updated successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    public ResponseEntity<ApiResponse> deleteAnswer(int answerId) {
        //Check answer existed or not
        Answer answer = answerRepository.findById(Integer.toString(answerId)).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED));
        answerRepository.deleteById(Integer.toString(answerId));
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Answer deleted successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
