package com.SWP.SkinCareService.dto.response.Booking;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TherapistAvailabilityResponse {
    String therapistId;

    LocalTime startTime;

    LocalTime endTime;
}
