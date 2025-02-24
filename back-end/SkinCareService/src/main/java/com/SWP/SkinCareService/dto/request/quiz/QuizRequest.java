package com.SWP.SkinCareService.dto.request.quiz;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizRequest {
    private int serviceCategoryId;
    private String quizName;

}
