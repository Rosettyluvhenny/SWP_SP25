package com.SWP.SkinCareService.dto.response.Feedback;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FeedbackResponse {
    String feedbackText;
    int rating;
    String serviceName;
    String therapistName;
}
