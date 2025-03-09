package com.SWP.SkinCareService.dto.request.Booking;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSessionRequest {
    int bookingId;
    String therapistId;
    LocalDateTime bookingTime;

}
