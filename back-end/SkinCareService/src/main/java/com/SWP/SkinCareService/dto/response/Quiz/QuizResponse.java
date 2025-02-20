package com.SWP.SkinCareService.dto.response.Quiz;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class QuizResponse {
    int serviceCategoryId;
    String name;
}
