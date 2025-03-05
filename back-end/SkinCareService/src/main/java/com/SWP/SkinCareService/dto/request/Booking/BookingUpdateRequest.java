package com.SWP.SkinCareService.dto.request.Booking;

import com.SWP.SkinCareService.enums.BookingStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class BookingUpdateRequest {
    @NotNull(message = "NOT_EMPTY")
    BookingStatus status;

    boolean paid;

    @NotNull(message = "NOT_EMPTY")
    @Min(value = 0, message = "MIN")
    int sessionRemain;

    @NotNull(message = "NOT_EMPTY")
    String staffId;
} 