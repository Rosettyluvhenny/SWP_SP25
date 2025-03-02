package com.SWP.SkinCareService.dto.request.Quiz;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionRequest {
    @NotNull(message = "NOT_EMPTY")
    private int quizId;

    @NotBlank(message ="NOT_EMPTY")
    private String questionText;

    @NotBlank(message ="NOT_EMPTY")
    private String questionType;
}
