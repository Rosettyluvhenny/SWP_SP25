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
public class QuizRequest {
    @Min(value = 1, message = "MIN_VALUE")
    private int serviceCategoryId;
    @NotBlank(message = "NOT_EMPTY")
    private String name;
}
