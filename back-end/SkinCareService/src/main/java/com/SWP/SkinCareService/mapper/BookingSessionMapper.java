package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.entity.BookingSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingSessionMapper {
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "sessionDateTime", source = "sessionDateTime")

    BookingSession toBookingSession(BookingSessionRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "staff", ignore = true)
        //@Mapping(target = "bookingDate", ignore = true)
    void updateBookingSession(@MappingTarget BookingSession bookingSession, BookingSessionUpdateRequest request);
    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomName", source = "room.name")
    @Mapping(target = "userId", source = "booking.user.id")
    @Mapping(target = "userName", source = "booking.user.fullName")
    @Mapping(target = "therapistId", source = "therapist.id")
    @Mapping(target = "therapistName", source = "therapist.user.fullName")
    @Mapping(target = "staffName", source = "staff.fullName")
    @Mapping(target = "staffId", source = "staff.id")
    @Mapping(target= "img", source="booking.service.img")
    @Mapping(target= "serviceName", source="booking.service.name")
    @Mapping(target= "serviceId", source="booking.service.id")
    @Mapping(target= "rated", source="rated")
    @Mapping(target = "phone", source = "booking.user.phone")

    BookingSessionResponse toBookingSessionResponse(BookingSession bookingSession);
}
