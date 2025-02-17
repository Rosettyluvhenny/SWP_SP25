package com.SWP.SkinCareService.service;

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
    private QuizService quizService;
    @Autowired
    private QuestionRepository questionRepository;

    public void createQuestion(QuestionCreateRequest request) {
        Question question = new Question();
        question.setQuiz(quizService.getQuizById(request.getQuizId()));
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOptions(request.getOption());
        question.setCreatedAt(request.getCreatedAt());
        question.setUpdatedAt(request.getUpdatedAt());
        questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(int id) {
        return questionRepository.findById(Integer.toString(id)).orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Transactional
    public void updateQuestion(int id, QuestionUpdateRequest request) {
        Question question = getQuestionById(id);
        question.setQuiz(quizService.getQuizById(request.getQuizId()));
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setOptions(request.getOption());
        question.setUpdatedAt(request.getUpdatedAt());
        questionRepository.save(question);
    }

    public void deleteQuestionById(int id) {
        questionRepository.deleteById(Integer.toString(id));
    }
}
