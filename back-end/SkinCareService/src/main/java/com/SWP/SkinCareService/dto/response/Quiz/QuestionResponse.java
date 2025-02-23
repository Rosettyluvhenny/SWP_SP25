package com.SWP.SkinCareService.dto.response.Quiz;

import com.SWP.SkinCareService.entity.Answer;
import com.SWP.SkinCareService.entity.Quiz;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class QuestionResponse {
    int id;
    Quiz quiz;
    String text;
    String type;
    Date createdAt;
    Date updatedAt;
    List<Answer> answers;
}
