package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Quiz.QuizResultRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResultResponse;
import com.SWP.SkinCareService.dto.response.Quiz.ResultResponse;
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
    @Mapping(target = "quiz", ignore = true)
    void updateQuizResult(@MappingTarget QuizResult quizResult, QuizResultRequest quizResultRequest);

    @Mapping(target = "services", source = "services")
    @Mapping(target = "users", source = "users")
    QuizResultResponse toQuizResultResponse(QuizResult quizResult);

    @Mapping(target = "services", source = "services")
    ResultResponse toResultResponse(QuizResult quizResult);
}
