package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.entity.Booking;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "payment", ignore = true)
    Booking toBooking(BookingRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "bookingSessions", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    //@Mapping(target = "paymentStatus", source = "paymentStatus", qualifiedByName = "stringToEnum")
    void updateBooking(BookingUpdateRequest request, @MappingTarget Booking booking);

    //@Mapping(target = "bookingSessions", ignore = true)
    @Mapping(target = "user.booking", ignore = true)
    @Mapping(target = "user.bookingServicesStaff", ignore = true)
    @Mapping(target = "user.bookingSessions", ignore = true)
    @Mapping(target = "service.bookings", ignore = true)
    @Mapping(target = "service.rooms", ignore = true)
    @Mapping(target = "payment.bookings", ignore = true)

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "fullName", source = "user.fullName")
    @Mapping(target = "serviceId", source = "service.id")
    @Mapping(target = "serviceName", source = "service.name")
    @Mapping(target = "paymentMethod", source = "payment.paymentName")
    BookingResponse toBookingResponse(Booking booking);

    /*
    @Named("stringToEnum")
    default PaymentStatus stringToEnum(String status) {
        return status != null ? PaymentStatus.valueOf(status.toUpperCase()) : null;
    }
     */

}
