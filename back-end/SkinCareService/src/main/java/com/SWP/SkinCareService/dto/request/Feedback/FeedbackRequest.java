package com.SWP.SkinCareService.dto.request.Feedback;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FeedbackRequest {
    @NotBlank(message = "NOT_EMPTY")
    private String feedbackText;

    @NotBlank(message = "NOT_EMPTY")
    @Min(value = 1, message = "MIN")
    @Max(value = 5, message = "Rating cannot be more than 5")
    Integer rating;


    boolean rated;
}
