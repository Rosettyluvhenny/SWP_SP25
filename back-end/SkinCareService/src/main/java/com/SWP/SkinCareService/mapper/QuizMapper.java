package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.quiz.QuizRequest;
import com.SWP.SkinCareService.dto.response.quiz.QuizResponse;
import com.SWP.SkinCareService.entity.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuizMapper {
    @Mapping(target = "serviceCategory", ignore = true)
    Quiz toQuiz(QuizRequest quiz);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "questions", ignore = true)
    void updateQuiz(@MappingTarget Quiz quiz, QuizRequest request);

    QuizResponse toQuizResponse(Quiz quiz);
}
