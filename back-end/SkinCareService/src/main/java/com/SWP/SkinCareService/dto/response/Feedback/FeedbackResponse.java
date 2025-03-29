package com.SWP.SkinCareService.dto.response.Feedback;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FeedbackResponse {
    Integer id;
    String userId;
    String username;
    String fullName;
    LocalDateTime createdAt;
    String feedbackText;
    int rating;
    String serviceName;
    String img;
    LocalDate bookingDate;
    String therapistName;
}
