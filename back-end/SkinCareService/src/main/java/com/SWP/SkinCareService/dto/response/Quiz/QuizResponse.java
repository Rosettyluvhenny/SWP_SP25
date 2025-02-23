package com.SWP.SkinCareService.dto.response.Quiz;

import com.SWP.SkinCareService.entity.Answer;
import com.SWP.SkinCareService.entity.Question;
import com.SWP.SkinCareService.entity.Quiz;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class QuizResponse {
    int id;
    int serviceCategoryId;
    String name;
    List<Question> questions;
}
