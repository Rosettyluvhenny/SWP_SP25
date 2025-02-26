package com.SWP.SkinCareService.dto.response.quiz;

import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizResultResponse {
    int id;
    String resultText;
    int rangePoint;
    List<User> users;
    List<Services> services;
}
