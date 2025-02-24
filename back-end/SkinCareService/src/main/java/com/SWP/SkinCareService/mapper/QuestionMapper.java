package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.response.quiz.QuestionResponse;
import com.SWP.SkinCareService.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuestionMapper {
    @Mapping(target = "quiz", ignore = true)
    Question toQuestion(QuestionRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "answers", ignore = true)
    void updateQuestion(@MappingTarget Question question, QuestionRequest request);

    QuestionResponse toQuestionResponse(Question question);

}
