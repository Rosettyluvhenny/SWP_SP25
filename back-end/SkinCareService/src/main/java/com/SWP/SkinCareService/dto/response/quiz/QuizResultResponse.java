package com.SWP.SkinCareService.dto.response.Quiz;

import com.SWP.SkinCareService.dto.response.basicDTO.ServiceDTO;
import com.SWP.SkinCareService.dto.response.basicDTO.UserDTO;
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
    int minPoint;
    int maxPoint;
    //Quiz quiz;
    int quizId;
    String quizName;

    List<UserDTO> users;
    List<ServiceDTO> services;
}
