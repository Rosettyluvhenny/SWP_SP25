package com.SWP.SkinCareService.dto.response.basicDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionDTO {
    int id;
    String text;
    String type;
    List<AnswerDTO> answers;

}
