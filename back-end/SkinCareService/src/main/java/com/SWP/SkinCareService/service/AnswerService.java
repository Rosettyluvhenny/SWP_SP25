package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Quiz.AnswerRequest;
import com.SWP.SkinCareService.dto.response.Quiz.AnswerResponse;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.AnswerMapper;
import com.SWP.SkinCareService.repository.QuestionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.SWP.SkinCareService.entity.Answer;
import com.SWP.SkinCareService.repository.AnswerRepository;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AnswerService {
    QuestionRepository questionRepository;
    AnswerRepository answerRepository;
    AnswerMapper answerMapper;

    @Transactional
    public AnswerResponse create(AnswerRequest request) {
        if (answerRepository.existsByText(request.getText())) {
            throw new AppException(ErrorCode.ANSWER_EXISTED);
        }

        Question question =getQuestion(request.getQuestionId());

        Answer answer = answerMapper.ToAnswer(request);
        answer.setQuestion(question);
        return answerMapper.ToAnswerResponse(answerRepository.save(answer));
    }

    public List<AnswerResponse> getAll() {
        return answerRepository.findAll().stream().map(answerMapper::ToAnswerResponse).toList();
    }


    public AnswerResponse getById(int id) {
        return answerMapper.ToAnswerResponse(getAnswer(id));
    }

    public List<AnswerResponse> getAllByQuestionId(int id){
        Question question = getQuestion(id);

        return answerRepository.findAllByQuestion(question).stream().map(answerMapper::ToAnswerResponse).toList();
    }
    @Transactional
    public AnswerResponse update(int answerId, AnswerRequest request) {
        Answer answer = answerRepository.findById(answerId).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED));
        Question question = getQuestion(request.getQuestionId());
        answerMapper.updateAnswer(request,answer);
        answer.setQuestion(question);
        return answerMapper.ToAnswerResponse(answerRepository.save(answer));
    }
    @Transactional
    public void delete(int id) {
        Answer answer = getAnswer(id);
        answerRepository.deleteById(id);
    }

    private Question getQuestion(int id){
        return questionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.QUIZ_NOT_EXISTED));
    }


    private Answer getAnswer(int id) {
        return answerRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.ANSWER_NOT_EXISTED));
    }
}
