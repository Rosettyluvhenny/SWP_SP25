package com.SWP.SkinCareService.dto.request.Booking;
import jakarta.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequest {

    @NotNull(message = "NOT_EMPTY")
    int serviceId;

    @NotNull(message = "NOT_EMPTY")
    int paymentId;

    String notes;

    int StaffId;
}
