package com.SWP.SkinCareService.dto.request.quiz;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizResultRequest {
    @NotBlank(message ="NOT_EMPTY")
    String resultText;

    @NotNull(message = "NOT_EMPTY")
    int rangePoint;

    @NotNull(message = "NOT_EMPTY")
    int serviceId;

    int quizId;
}
