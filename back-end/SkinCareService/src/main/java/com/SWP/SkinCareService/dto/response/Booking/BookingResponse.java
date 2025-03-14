package com.SWP.SkinCareService.dto.response.Booking;

import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    int id;
    String userId;
    String fullName;

    //Services service;
    int serviceId;
    String serviceName;

    BookingStatus status;
    PaymentStatus paymentStatus;
    //Payment payment;
    String paymentMethod;

    String notes;
    Date createAt;
    Date updateAt;
    int sessionRemain;
    String img;
//    List<BookingSession> bookingSessions;
    int price;
    String url;

}
