package com.SWP.SkinCareService.dto.request.Booking;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSessionRequest {
    @NotNull(message = "NOT_EMPTY")
    int bookingId;

    @NotNull(message = "NOT_EMPTY")
    LocalDateTime sessionDateTime;


    String note;


    String therapistId;
}
