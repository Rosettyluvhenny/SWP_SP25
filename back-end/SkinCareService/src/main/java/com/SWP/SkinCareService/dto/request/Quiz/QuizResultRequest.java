package com.SWP.SkinCareService.dto.request.Quiz;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizResultRequest {
    @NotBlank(message ="NOT_EMPTY")
    String name;

    @NotBlank(message ="NOT_EMPTY")
    String resultText;

    @Min(value = 0, message = "MIN_VALUE")
    int minPoint;

    @Min(value = 0, message = "MIN_VALUE")
    int maxPoint;

    @NotNull(message = "NOT_EMPTY")
    List<Integer> serviceId;

    @Min(value = 1, message = "MIN_VALUE")
    int quizId;
}
