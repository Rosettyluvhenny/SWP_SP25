package com.SWP.SkinCareService.dto.response.Quiz;

import com.SWP.SkinCareService.dto.response.basicDTO.AnswerDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
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
    List<AnswerDTO> answers;
}
