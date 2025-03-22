package com.SWP.SkinCareService.dto.response.Feedback;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FeedbackResponse {
    Integer id;
    String feedbackText;
    int rating;
    String serviceName;
    String img;
    LocalDate bookingDate;
    String therapistName;
    boolean rated;
}
