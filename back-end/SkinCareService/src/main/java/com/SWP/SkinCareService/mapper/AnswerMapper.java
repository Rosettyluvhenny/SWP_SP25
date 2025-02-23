package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Quiz.AnswerRequest;
import com.SWP.SkinCareService.dto.request.Quiz.QuestionRequest;
import com.SWP.SkinCareService.dto.response.Quiz.AnswerResponse;
import com.SWP.SkinCareService.entity.Answer;
import com.SWP.SkinCareService.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AnswerMapper {
    @Mapping(target = "question", ignore = true)
    Answer ToAnswer(AnswerRequest request);
    AnswerResponse ToAnswerResponse(Answer answer);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    void updateAnswer(AnswerRequest request, @MappingTarget Answer answer);
}
