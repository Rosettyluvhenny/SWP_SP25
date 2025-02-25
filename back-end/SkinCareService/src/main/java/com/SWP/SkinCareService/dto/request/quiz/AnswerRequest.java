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
public class AnswerRequest {
    @NotNull(message = "NOT_EMPTY")
    private int questionId;

    @NotBlank(message ="NOT_EMPTY")
    private String answerText;

    @NotNull(message = "NOT_EMPTY")
    private int point;

}
