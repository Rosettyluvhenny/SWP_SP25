package com.SWP.SkinCareService.dto.request.Booking;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    String userId;
    int serviceId;
    int paymentId;
    LocalDateTime bookingTime;
    String note;
    String therapistId;
}
