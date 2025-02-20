package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.repository.QuestionRepository;
import com.SWP.SkinCareService.dto.request.QuestionRequest;

import java.util.List;

@Service
public class QuestionService {
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuestionRepository questionRepository;

    public ResponseEntity<ApiResponse> createQuestion(QuestionRequest request) {
        Question question = new Question();
        //Check quiz existed or not
        int quizId = request.getQuizId();
        Quiz quiz = quizRepository.findById(Integer.toString(quizId)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        //Create
        question.setQuiz(quiz);
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOptions(request.getOption());
        questionRepository.save(question);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.CREATED.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Question created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(int id) {
        return questionRepository.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
    }

    @Transactional
    public ResponseEntity<ApiResponse> updateQuestion(int id, QuestionRequest request) {
        //Check question existed or not
        Question question = questionRepository.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
        //Check quiz existed or not
        int quizId = request.getQuizId();
        Quiz quiz = quizRepository.findById(Integer.toString(quizId)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        //Update
        question.setQuiz(quiz);
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOptions(request.getOption());
        questionRepository.save(question);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Question updated successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    public ResponseEntity<ApiResponse> deleteQuestionById(int id) {
        //Check question existed or not
        Question question = questionRepository.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
        //Delete
        questionRepository.deleteById(Integer.toString(id));
        //Response
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Question deleted successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
