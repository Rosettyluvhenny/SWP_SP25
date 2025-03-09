package com.SWP.SkinCareService.dto.request.Quiz;

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
public class QuestionRequest {
    @Min(value = 1, message = "MIN_VALUE")
    int quizId;
    @NotBlank(message ="NOT_EMPTY")
    String text;
    @NotBlank(message = "NOT_EMPTY")
    String type;
}