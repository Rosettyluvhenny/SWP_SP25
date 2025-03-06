package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
import com.SWP.SkinCareService.dto.response.basicDTO.QuestionDTO;
import com.SWP.SkinCareService.dto.response.basicDTO.QuizResultDTO;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.entity.QuizResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuizMapper {
    @Mapping(target = "serviceCategory", ignore = true)
    @Mapping(target = "name", source = "name")
    Quiz toQuiz(QuizRequest quiz);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "questions", ignore = true)
    void updateQuiz(QuizRequest request,@MappingTarget Quiz quiz);

    @Mapping(target = "name", source = "name")
    @Mapping(target = "categoryId", source = "serviceCategory.id")
    @Mapping(target = "categoryName", source = "serviceCategory.name")
    @Mapping(target = "questions", expression = "java(toQuestionDTOList(quiz.getQuestions()))")
    //@Mapping(target = "quizResults", expression = "java(toQuizResultDTOList(quiz.getQuizResults()))")
    QuizResponse toResponse(Quiz quiz);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "text", source = "text")
    @Mapping(target = "type", source = "type")
    QuestionDTO toQuestionDTO(Question question);
    List<QuestionDTO> toQuestionDTOList(List<Question> questions);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "text", source = "resultText")
    QuizResultDTO toQuizResultDTO(QuizResult quizResult);
    List<QuizResultDTO> toQuizResultDTOList(List<QuizResult> quizResults);



}
