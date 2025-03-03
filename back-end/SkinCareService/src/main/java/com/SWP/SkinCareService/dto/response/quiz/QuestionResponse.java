package com.SWP.SkinCareService.dto.response.Quiz;

import com.SWP.SkinCareService.entity.Answer;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionResponse {
    int id;
    String text;
    String type;
    Date createdAt;
    Date updatedAt;
    List<Answer> answers;
}
