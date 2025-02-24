package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.quiz.AnswerRequest;
import com.SWP.SkinCareService.dto.response.quiz.AnswerResponse;
import com.SWP.SkinCareService.entity.Answer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AnswerMapper {
    @Mapping(target = "question", ignore = true)
    Answer toAnswer(AnswerRequest request);

    @Mapping(target = "id", ignore = true)
    void updateAnswer(@MappingTarget Answer answer, AnswerRequest request);

    AnswerResponse toAnswerResponse(Answer answer);
}
