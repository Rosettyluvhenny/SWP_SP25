package com.SWP.SkinCareService.dto.request.Quiz;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizResultRequest {
    @NotBlank(message ="NOT_EMPTY")
    String resultText;

    @NotNull(message = "NOT_EMPTY")
    int minPoint;

    @NotNull(message = "NOT_EMPTY")
    int maxPoint;

    @NotNull(message = "NOT_EMPTY")
    int serviceId;

    int quizId;
}
