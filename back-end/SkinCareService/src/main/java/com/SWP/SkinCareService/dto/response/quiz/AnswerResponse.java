package com.SWP.SkinCareService.dto.response.quiz;

import com.SWP.SkinCareService.entity.Question;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerResponse {
    int id;
    String answerText;
    Date createdAt;
    int point;
    Question question;
}
