package com.SWP.SkinCareService.dto.request.Quiz;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class QuestionRequest {
    int quizId;
    String text;
    String type;
}
