package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.quiz.QuizResultRequest;
import com.SWP.SkinCareService.dto.response.quiz.QuizResultResponse;
import com.SWP.SkinCareService.entity.QuizResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuizResultMapper {
    QuizResult toQuizResult(QuizResultRequest quizResult);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "services", ignore = true)
    void updateQuizResult(@MappingTarget QuizResult quizResult, QuizResultRequest quizResultRequest);

    QuizResultResponse toQuizResultResponse(QuizResult quizResult);
}
