package com.SWP.SkinCareService.dto.response;

import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSessionResponse {
    int id;
    Booking booking;
    Date bookingDate;
    LocalTime bookingTime;
    String status;
    String note;
    String imgBefore;
    String imgAfter;
    Room room;
    User user;
}
