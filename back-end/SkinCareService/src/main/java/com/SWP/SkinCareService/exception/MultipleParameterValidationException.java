package com.SWP.SkinCareService.exception;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MultipleParameterValidationException extends RuntimeException {
    List<String> missingParameters;

    public MultipleParameterValidationException(List<String> missingParameters) {
        this.missingParameters = missingParameters;
    }

    public List<String> getMissingParameters() {
        return missingParameters;
    }
}