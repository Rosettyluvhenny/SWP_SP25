package com.SWP.SkinCareService.dto.response.Quiz;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class QuestionResponse {
    private int quizId;
    private String text;
    private String type;
}
