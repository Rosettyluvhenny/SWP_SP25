package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingMapper {

    Booking toBooking(BookingRequest request);

    @Mapping(target= "username", source = "user.fullName" )
    @Mapping(target= "staffName", source = "user.fullName" )
    @Mapping(target= "serviceName", source = "service.name" )
    @Mapping(target= "userId", source = "user.id" )
    @Mapping(target= "serviceId", source = "service.id" )
    @Mapping(target= "staffId", source = "staff.id" )
    BookingResponse toResponse(Booking booking);


    void update(@MappingTarget Booking booking, BookingRequest request);
}
