package com.SWP.SkinCareService.dto.response.BookingSession;

import com.SWP.SkinCareService.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSessionResponse {
    int id;

    int bookingId;

    String username;

    LocalDateTime sessionDateTime;

    String status;

    String note;

    String imgBefore;

    String imgAfter;

    String therapistId;

    String therapistName;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
} 