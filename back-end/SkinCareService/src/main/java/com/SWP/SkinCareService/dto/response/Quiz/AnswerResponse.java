package com.SWP.SkinCareService.dto.response.Quiz;

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
    String text;
    Date createdAt;
    int point;
    Question question;
}
