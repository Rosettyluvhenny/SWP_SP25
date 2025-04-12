package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuestionResponse;
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
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class QuestionService {
    QuestionRepository questionRepository;
    QuestionMapper questionMapper;
    QuizRepository quizRepository;

    @Transactional
    public QuestionResponse create(QuestionRequest request) {
        //Check quiz
        Quiz quiz = getQuiz(request.getQuizId());
        List<Question> questionList = quiz.getQuestions();
        //Check question existed by quiz or not
        for (Question question : questionList) {
            if (question.getText().equals(request.getText())) {
                throw new AppException(ErrorCode.QUESTION_EXISTED);
            }
        }
        //Convert
        Question question = questionMapper.toQuestion(request);
        question.setQuiz(quiz);
        return questionMapper.toResponse(questionRepository.save(question));
    }

    public List<QuestionResponse> getAll() {
        return questionRepository.findAll().stream().map(questionMapper::toResponse).toList();
    }

    public List<QuestionResponse> getByQuizId(int quizId){
        Quiz quiz = getQuiz(quizId);
        return questionRepository.findByQuiz(quiz).stream().map(questionMapper::toResponse).toList();
    }

    public QuestionResponse getById(int id) {
        return questionMapper.toResponse(getQuestion(id));
    }

    public QuestionResponse update(int id, QuestionRequest request){
        Question question = getQuestion(id);

        if (question.getQuiz().isStatus()) {
            throw new AppException(ErrorCode.QUIZ_IS_ACTIVE);
        }
        questionMapper.updateQuestion(question,request);

        return questionMapper.toResponse(questionRepository.save(question));
    }

    public void delete(int id) {
        Question question = getQuestion(id);
        if (question.getQuiz().isStatus()) {
            throw new AppException(ErrorCode.QUIZ_IS_ACTIVE);
        }
        questionRepository.delete(question);
    }


    private Question getQuestion(int id){
        return questionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUESTION_NOT_EXISTED));
    }

    private Quiz getQuiz(int id){
        return quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }
}
