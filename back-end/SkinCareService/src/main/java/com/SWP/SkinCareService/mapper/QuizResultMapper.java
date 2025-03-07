package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Quiz.QuizResultRequest;
import com.SWP.SkinCareService.dto.response.Quiz.QuizResultResponse;
import com.SWP.SkinCareService.dto.response.Quiz.ResultResponse;
import com.SWP.SkinCareService.dto.response.basicDTO.ServiceDTO;
import com.SWP.SkinCareService.dto.response.basicDTO.UserDTO;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuizResultMapper {
    QuizResult toQuizResult(QuizResultRequest quizResult);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "users", ignore = true)
    //@Mapping(target = "services", ignore = true)
    @Mapping(target = "quiz", ignore = true)
    void updateQuizResult(@MappingTarget QuizResult quizResult, QuizResultRequest quizResultRequest);

    //@Mapping(target = "services", expression = "java(toServiceDTOList(quizResult.getServices()))")
    //@Mapping(target = "users", expression = "java(toUserDTOList(quizResult.getUsers()))")
    @Mapping(target = "quizId", source = "quiz.id")
    @Mapping(target = "quizName", source = "quiz.name")
    QuizResultResponse toQuizResultResponse(QuizResult quizResult);

    @Mapping(target = "services", expression = "java(toServiceDTOList(quizResult.getServices()))")
    ResultResponse toResultResponse(QuizResult quizResult);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "duration", source = "duration")
    @Mapping(target = "session", source = "session")
    @Mapping(target = "img", source = "img")
    @Mapping(target = "description", source = "description")
    ServiceDTO toServiceDTO(Services service);

    List<ServiceDTO> toServiceDTOList(List<Services> services);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "phone", source = "phone")
    UserDTO toUserDTO(User user);
    List<UserDTO> toUserDTOList(List<User> users);

}
