package com.SWP.SkinCareService.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class QuizCreateRequest {
    private int serviceCategoryId;
    private String quizName;

}
