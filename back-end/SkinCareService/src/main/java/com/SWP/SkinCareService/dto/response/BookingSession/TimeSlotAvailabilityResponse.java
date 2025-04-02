package com.SWP.SkinCareService.dto.response.BookingSession;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TimeSlotAvailabilityResponse {
    LocalTime startTime;
    LocalTime endTime;
} 