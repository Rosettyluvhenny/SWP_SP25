package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.enums.BookingStatus;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingMapper {

    @Mapping(target = "status", constant = "PENDING")
    Booking toBooking(BookingRequest request);

    @Mapping(target = "username", source = "user.fullName")
    @Mapping(target = "staffName", source = "staff.fullName")
    @Mapping(target = "serviceName", source = "service.name")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "serviceId", source = "service.id")
    @Mapping(target = "staffId", source = "staff.id")
    @Mapping(target = "img", source = "service.img")
    BookingResponse toResponse(Booking booking);

    void update(@MappingTarget Booking booking, BookingRequest request);

    @AfterMapping
    default void setDefaultStatus(@MappingTarget Booking booking) {
        if (booking.getStatus() == null) {
            booking.setStatus(BookingStatus.PENDING);
        }
    }
}
