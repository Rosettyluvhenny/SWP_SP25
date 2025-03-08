package com.SWP.SkinCareService.dto.request.Booking;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSessionRequest {
    String userId;
    int bookingId;
    String status;
    String note;
    String imgBefore;
    //String imgAfter;
    int roomId;
    String therapistId;

}
