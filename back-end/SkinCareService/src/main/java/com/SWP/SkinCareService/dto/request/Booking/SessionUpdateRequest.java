package com.SWP.SkinCareService.dto.request.Booking;

import com.SWP.SkinCareService.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionUpdateRequest {
    @NotNull(message = "NOT_EMPTY")
    LocalDateTime sessionDateTime;

    @NotNull(message = "NOT_EMPTY")
    BookingStatus status;

    String note;

    String imgBefore;

    String imgAfter;

    @NotNull(message = "NOT_EMPTY")
    String therapistId;
}
