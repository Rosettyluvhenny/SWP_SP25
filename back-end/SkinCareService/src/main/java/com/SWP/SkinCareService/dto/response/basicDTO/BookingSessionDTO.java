package com.SWP.SkinCareService.dto.response.basicDTO;

import com.SWP.SkinCareService.entity.Feedback;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSessionDTO {
    int id;
    int bookingId;  // Instead of full Booking object
    Date bookingDate;
    LocalDateTime sessionDateTime;
    //
    String serviceName;
    int serviceId;
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
    //
    String staffId;
    String staffName;

    // img
    String img;

    String description;

    String feedbackText;
    Integer rating;

}
