package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Quiz.QuizRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResponse;
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
    void updateQuiz(QuizRequest request,@MappingTarget Quiz quiz);
    QuizResponse toResponse(Quiz quiz);

}
