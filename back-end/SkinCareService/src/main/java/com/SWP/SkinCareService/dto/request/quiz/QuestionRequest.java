package com.SWP.SkinCareService.dto.request.quiz;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionRequest {
    private int quizId;
    private String questionText;
    private String questionType;
    private String option;
}
