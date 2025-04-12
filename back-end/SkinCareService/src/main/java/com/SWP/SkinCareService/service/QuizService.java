package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.request.Quiz.UserResultRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
import com.SWP.SkinCareService.dto.response.Skin.ResultResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.QuizMapper;
import com.SWP.SkinCareService.mapper.QuizResultMapper;
import com.SWP.SkinCareService.repository.BlogPostRepository;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.repository.QuizRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class QuizService {
    QuizRepository quizRepository;
    QuizMapper quizMapper;

    ServiceCategoryRepository serviceCategoryRepository;
    QuizResultService quizResultService;
    QuizResultMapper quizResultMapper;

    BlogPostRepository blogPostRepository;


    @Transactional
    public QuizResponse create(QuizRequest request) {
        //Check category
        ServiceCategory serviceCategory = getCategory(request.getServiceCategoryId());
        List<Quiz> quizList= serviceCategory.getQuiz();
        //Check quiz existed by category or not
        for (Quiz quiz : quizList) {
            if (quiz.getName().equals(request.getName())) {
                throw new AppException(ErrorCode.QUIZ_EXISTED);
            }
        }
        //Convert
        Quiz quiz = quizMapper.toQuiz(request);
        quiz.setServiceCategory(serviceCategory);
        quiz.setStatus(false);
        quizRepository.save(quiz);
        return quizMapper.toResponse(quiz);
    }

    public List<QuizResponse> getAll() {
        return quizRepository.findAll().stream().map(quizMapper::toResponse).toList();
    }

    public QuizResponse getById(int id) {
        return quizMapper.toResponse(getQuiz(id));
    }

    @Transactional
    public QuizResponse update(int id, QuizRequest request) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
        quizMapper.updateQuiz(request,quiz);
        if (quiz.isStatus()) {
            throw new AppException(ErrorCode.QUIZ_IS_ACTIVE);
        }
        int serviceCategoryId = request.getServiceCategoryId();
        ServiceCategory serviceCategory = getCategory(serviceCategoryId);
        quiz.setServiceCategory(serviceCategory);
        quiz.setStatus(false);
        quizRepository.save(quiz);
        return quizMapper.toResponse(quiz);
    }

    @Transactional
    public void delete(int id) {
        Quiz quiz = getQuiz(id);
        if (quiz.isStatus()) {
            throw new AppException(ErrorCode.QUIZ_IS_ACTIVE);
        }
        List<QuizResult> quizResults = quiz.getQuizResults();
        for (QuizResult quizResult : quizResults) {
            quizResult.setQuiz(null);
            quizResultService.deleteQuizResult(quizResult.getId());

            List<BlogPost> blogPostsList = quizResult.getBlogPosts();
            for (BlogPost blogPost : blogPostsList) {
                blogPost.setQuizResult(null);
                blogPost.setDefaultBlog(false);
                blogPostRepository.save(blogPost);
            }
        }
        quizRepository.delete(quiz);
    }
    private Quiz getQuiz(int id) {
        return quizRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }
    private ServiceCategory getCategory(int id){
        return serviceCategoryRepository.findById(id).
                orElseThrow(()-> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
    }

    public ResultResponse getResult(UserResultRequest request){
        int quizId = request.getQuizId();

        int score = request.getScore();
        QuizResult skinType = null;

        for (QuizResult result : quizResultService.getQuizResultsByQuizId(quizId)) {
            if ((result.getMinPoint() <= score) && (score <= result.getMaxPoint())) {
                skinType = result;
            }
        }
        if (skinType == null) {
            throw new AppException(ErrorCode.RESULT_NOT_EXISTED);
        }

        return quizResultMapper.toResultResponse(skinType);
    }

    public void enable(int quizId) {
        Quiz quiz = getQuiz(quizId);
        //Check question
        List<Question> questions = quiz.getQuestions();
        if (questions == null || questions.isEmpty()) {
            throw new AppException(ErrorCode.QUESTION_EMPTY);
        } else {
            //Check answer
            for (Question question : questions) {
                if (question.getAnswers() == null || question.getAnswers().isEmpty()) {
                    throw new AppException(ErrorCode.ANSWER_EMPTY);
                }
            }
        }
        //Check result
        List<QuizResult> quizResults = quiz.getQuizResults();
        if (quizResults == null || quizResults.isEmpty()) {
            throw new AppException(ErrorCode.RESULT_EMPTY);
        } else {
            //Check blog
            for (QuizResult result : quizResults) {
                if (result.getBlogPosts() == null || result.getBlogPosts().isEmpty()) {
                    throw new AppException(ErrorCode.BLOGPOST_EMPTY);
                }
            }
        }
        quiz.setStatus(true);
        quizRepository.save(quiz);
    }

    public void disable(int quizId) {
        Quiz quiz = getQuiz(quizId);
        quiz.setStatus(false);
        quizRepository.save(quiz);
    }

}
