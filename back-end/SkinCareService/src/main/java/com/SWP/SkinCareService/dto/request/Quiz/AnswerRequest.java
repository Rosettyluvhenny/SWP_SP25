package com.SWP.SkinCareService.dto.request.Quiz;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AnswerRequest {
    @NotNull(message = "NOT_EMPTY")
    private int questionId;

    @NotBlank(message ="NOT_EMPTY")
    private String text;

    @NotNull(message = "NOT_EMPTY")
    private int point;

}
