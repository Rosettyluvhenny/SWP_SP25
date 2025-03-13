package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Feedback.FeedbackRequest;
import com.SWP.SkinCareService.dto.response.Feedback.FeedbackResponse;
import com.SWP.SkinCareService.entity.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FeedbackMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "bookingSession", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "therapist", ignore = true)
    Feedback toFeedBack(FeedbackRequest feedback);

    @Mapping(target = "serviceName", source = "bookingSession.booking.service.name")
    @Mapping(target = "therapistName", source = "bookingSession.therapist.user.fullName")
    @Mapping(target = "id", source = "id")
    FeedbackResponse toFeedbackResponse(Feedback feedback);

    void updateFeedback(FeedbackRequest request,  @MappingTarget Feedback feedback);
}
