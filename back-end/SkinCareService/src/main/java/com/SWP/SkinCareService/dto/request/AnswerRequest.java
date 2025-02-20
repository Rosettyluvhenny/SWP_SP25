package com.SWP.SkinCareService.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AnswerRequest {
    private int questionId;
    private String answerText;
    private int point;

}
