package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.SessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.enums.BookingStatus;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingSessionMapper {

    @Mapping(target = "status", constant = "PENDING")
    BookingSession toBookingSession(BookingSessionRequest request);

    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "username", source = "booking.user.fullName")
    @Mapping(target = "therapistId", source = "therapist.id")
    @Mapping(target = "therapistName", source = "therapist.user.fullName")
    BookingSessionResponse toResponse(BookingSession bookingSession);

    void update(@MappingTarget BookingSession bookingSession, SessionUpdateRequest request);

    @AfterMapping
    default void setDefaultStatus(@MappingTarget BookingSession bookingSession) {
        if (bookingSession.getStatus() == null) {
            bookingSession.setStatus(BookingStatus.PENDING);
        }
    }
} 