package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuestionResponse;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.entity.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuestionMapper {
    @Mapping(target = "quiz", ignore = true)
    Question toQuestion(QuestionRequest request);
    QuestionResponse toQuestionResponse(Question Question);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "answers", ignore = true)
    void updateQuestion(QuestionRequest request, @MappingTarget Question question);
}
