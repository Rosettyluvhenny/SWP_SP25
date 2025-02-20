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
public class AnswerUpdateRequest {
    @NotNull(message = "")
    private int questionId;

    @NotBlank
    private String answerText;

    @NotNull
    private int point;

}
