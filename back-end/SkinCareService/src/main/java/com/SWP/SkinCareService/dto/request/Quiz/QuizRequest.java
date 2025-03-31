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
public class QuizRequest {
    @NotBlank(message = "NOT_EMPTY")
    private int serviceCategoryId;
    @NotBlank(message = "NOT_EMPTY")
    private String name;
}
