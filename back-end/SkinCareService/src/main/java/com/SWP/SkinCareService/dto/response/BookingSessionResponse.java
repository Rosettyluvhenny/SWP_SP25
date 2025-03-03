package com.SWP.SkinCareService.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalTime;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSessionResponse {
    int id;
    int bookingId;  // Instead of full Booking object
    Date bookingDate;
    LocalTime bookingTime;
    String status;
    String note;
    String imgBefore;
    String imgAfter;
    
    // Room details
    int roomId;
    String roomName;
    
    // User details
    String userId;
    String userName;
    
    // Therapist details
    String therapistId;
    String therapistName;
}
