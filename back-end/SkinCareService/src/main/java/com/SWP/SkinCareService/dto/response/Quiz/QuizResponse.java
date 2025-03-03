package com.SWP.SkinCareService.dto.response.Quiz;

import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.entity.ServiceCategory;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizResponse {
    int id;
    String name;
    ServiceCategory serviceCategory;
    List<Question> questions;
    List<QuizResult> quizResults;
}
