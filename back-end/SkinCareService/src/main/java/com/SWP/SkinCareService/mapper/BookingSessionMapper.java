package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.BookingSessionRequest;
import com.SWP.SkinCareService.dto.response.BookingSessionResponse;
import com.SWP.SkinCareService.entity.BookingSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingSessionMapper {
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "cancelBy", ignore = true)
    BookingSession toBookingSession(BookingSessionRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "cancelBy", ignore = true)
    @Mapping(target = "bookingDate", ignore = true)
    void updateBookingSession(@MappingTarget BookingSession bookingSession, BookingSessionRequest request);

    @Mapping(target = "booking.bookingSessions", ignore = true)
    @Mapping(target = "booking.user.booking", ignore = true)
    @Mapping(target = "booking.user.bookingServicesStaff", ignore = true)
    @Mapping(target = "booking.user.bookingSessions", ignore = true)
    @Mapping(target = "booking.service.bookings", ignore = true)
    @Mapping(target = "booking.service.rooms", ignore = true)
    @Mapping(target = "booking.payment.bookings", ignore = true)
    @Mapping(target = "booking.staff.booking", ignore = true)
    @Mapping(target = "booking.staff.bookingServicesStaff", ignore = true)
    @Mapping(target = "booking.staff.bookingSessions", ignore = true)
    @Mapping(target = "room.bookingSessions", ignore = true)
    @Mapping(target = "room.services", ignore = true)
    BookingSessionResponse toBookingSessionResponse(BookingSession bookingSession);
}
