package com.SWP.SkinCareService.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class QuestionRequest {
    private int quizId;
    private String questionText;
    private String questionType;
    private String option;
}
