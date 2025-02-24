package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.quiz.QuestionResponse;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.QuestionMapper;
import com.SWP.SkinCareService.repository.QuizRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.repository.QuestionRepository;
import com.SWP.SkinCareService.dto.request.quiz.QuestionRequest;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class QuestionService {

    private QuizRepository quizRepository;

    private QuestionRepository questionRepository;

    private QuestionMapper questionMapper;

    @Transactional
    public QuestionResponse createQuestion(QuestionRequest request) {
        //Check quiz existed or not
        int quizId = request.getQuizId();
        Quiz quiz = getQuizById(quizId);
        //Create
        Question question = questionMapper.toQuestion(request);
        question.setQuiz(quiz);
        questionRepository.save(question);

        return questionMapper.toQuestionResponse(question);
    }

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream().map(questionMapper::toQuestionResponse).toList();
    }

    public QuestionResponse getQuestionById(int id) {
        return questionMapper.toQuestionResponse(questionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED)));
    }

    @Transactional
    public QuestionResponse updateQuestion(int id, QuestionRequest request) {
        //Check question existed or not
        Question question = checkQuestion(id);
        //Check quiz existed or not
        int quizId = request.getQuizId();
        Quiz quiz = getQuizById(quizId);
        //Update
        questionMapper.updateQuestion(question, request);
        question.setQuiz(quiz);
        questionRepository.save(question);

        return questionMapper.toQuestionResponse(question);
    }

    public void deleteQuestion(int id) {
        //Check question existed or not
        Question question = checkQuestion(id);
        questionRepository.delete(question);
    }

    private Quiz getQuizById(int id) {
        return quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }

    private Question checkQuestion(int id) {
        return questionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
    }
}
