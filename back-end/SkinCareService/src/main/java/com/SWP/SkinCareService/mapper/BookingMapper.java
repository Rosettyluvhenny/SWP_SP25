package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.BookingRequest;
import com.SWP.SkinCareService.dto.response.BookingResponse;
import com.SWP.SkinCareService.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "staff", ignore = true)
    Booking toBooking(BookingRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "bookingSessions", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    void updateBooking(BookingRequest request, @MappingTarget Booking booking);

    //@Mapping(target = "bookingSessions", ignore = true)
    @Mapping(target = "user.booking", ignore = true)
    @Mapping(target = "user.bookingServicesStaff", ignore = true)
    @Mapping(target = "user.bookingSessions", ignore = true)
    @Mapping(target = "service.bookings", ignore = true)
    @Mapping(target = "service.rooms", ignore = true)
    @Mapping(target = "payment.bookings", ignore = true)
    @Mapping(target = "staff.booking", ignore = true)
    @Mapping(target = "staff.bookingServicesStaff", ignore = true)
    @Mapping(target = "staff.bookingSessions", ignore = true)
    BookingResponse toBookingResponse(Booking booking);

}
