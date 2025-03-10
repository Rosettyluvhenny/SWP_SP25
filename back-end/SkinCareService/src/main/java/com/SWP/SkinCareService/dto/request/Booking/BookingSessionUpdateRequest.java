package com.SWP.SkinCareService.dto.request.Booking;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSessionUpdateRequest {
    String status;
    String note;
    //String imgBefore;
    //String imgAfter;
    Integer roomId;
    String therapistId;
}
