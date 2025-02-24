package com.SWP.SkinCareService.dto.response.quiz;

import com.SWP.SkinCareService.entity.Question;
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
    String quizName;
    ServiceCategory serviceCategory;
    List<Question> questions;
}
