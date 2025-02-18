package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.repository.QuestionRepository;
import com.SWP.SkinCareService.dto.request.QuestionCreateRequest;
import com.SWP.SkinCareService.dto.request.QuestionUpdateRequest;

import java.util.List;

@Service
public class QuestionService {
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuestionRepository questionRepository;

    public void createQuestion(QuestionCreateRequest request) {
        Question question = new Question();

        int quizId = request.getQuizId();
        Quiz quiz = quizRepository.findById(Integer.toString(quizId)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        question.setQuiz(quiz);
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOptions(request.getOption());
        questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(int id) {
        return questionRepository.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
    }

    @Transactional
    public void updateQuestion(int id, QuestionUpdateRequest request) {
        Question question = questionRepository.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));

        int quizId = request.getQuizId();
        Quiz quiz = quizRepository.findById(Integer.toString(quizId)).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));

        question.setQuiz(quiz);
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOptions(request.getOption());
        questionRepository.save(question);
    }

    public void deleteQuestionById(int id) {
        questionRepository.deleteById(Integer.toString(id));
    }
}
