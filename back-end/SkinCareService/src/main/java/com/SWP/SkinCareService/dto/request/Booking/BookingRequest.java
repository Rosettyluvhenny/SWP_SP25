package com.SWP.SkinCareService.dto.request.Booking;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    int serviceId;
    int paymentId;
    LocalDateTime bookingTime;
    String notes;
    @NotBlank(message="NOT_EMPTY")
    String therapistId;
}
