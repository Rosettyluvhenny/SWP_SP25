package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Quiz.QuestionResponse;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.QuestionMapper;
import com.SWP.SkinCareService.repository.QuizRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.repository.QuestionRepository;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class QuestionService {
    QuizRepository quizRepository;

    QuestionRepository questionRepository;

    QuestionMapper questionMapper;

    @Transactional
    public QuestionResponse create(QuestionRequest request) {
        int quizId = request.getQuizId();
        Quiz quiz = quizCheck(request.getQuizId());
        Question question = questionMapper.toQuestion(request);
        question.setQuiz(quiz);
       return questionMapper.toQuestionResponse(questionRepository.save(question));
    }

    public List<QuestionResponse> getAll() {
        return questionRepository.findAll().stream().map(questionMapper::toQuestionResponse).toList();
    }

    public List<QuestionResponse> getByQuizId(int quizId){
        Quiz quiz = quizCheck(quizId);
        return questionRepository.findByQuiz(quiz).stream().map(questionMapper::toQuestionResponse).toList();
    }

    public QuestionResponse getById(int id) {
        return questionMapper.toQuestionResponse(questionCheck(id));
    }

    @Transactional
    public QuestionResponse update(int id, QuestionRequest request) {
        Question question = questionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));

        int quizId = request.getQuizId();
        Quiz quiz = quizCheck(quizId);

        questionMapper.updateQuestion(request,question);
        question.setQuiz(quiz);
        questionRepository.save(question);

        return questionMapper.toQuestionResponse(question);
    }
    @Transactional
    public ResponseEntity<ApiResponse> deleteQuestionById(int id) {
        Question question = questionCheck(id);
        questionRepository.deleteById(id);
        //Response
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Question deleted successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    private Question questionCheck(int id){
        return questionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
    }

    private Quiz quizCheck(int id){
        return quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }
}
