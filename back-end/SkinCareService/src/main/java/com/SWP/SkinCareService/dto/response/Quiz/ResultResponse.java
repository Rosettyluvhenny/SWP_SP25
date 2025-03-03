package com.SWP.SkinCareService.dto.response.Quiz;

import com.SWP.SkinCareService.entity.Services;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultResponse {
    int id;
    String resultText;
    List<Services> services;
}
