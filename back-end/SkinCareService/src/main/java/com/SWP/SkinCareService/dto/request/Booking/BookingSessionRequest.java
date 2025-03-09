package com.SWP.SkinCareService.dto.request.Booking;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class BookingSessionRequest {
    @NotNull(message = "NOT_EMPTY")
    String userId;
    int bookingId;

    @NotNull(message = "NOT_EMPTY")
    LocalDateTime sessionDateTime;

    String status;
    String note;

    String imgBefore;

//    String imgAfter;

    @NotNull(message = "NOT_EMPTY")
    //String imgAfter;
    int roomId;
    String therapistId;
} 