package com.SWP.SkinCareService.exception;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.*;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception){
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, List<ApiResponse>>> handlingValidationException(MethodArgumentNotValidException exception) {
        List<ApiResponse> errors = exception.getBindingResult().getFieldErrors().stream().map(fieldError -> {
            String enumKey = fieldError.getDefaultMessage();
            String fieldName = fieldError.getField();
            ErrorCode errorCode = ErrorCode.INVALID_KEY;
            Map<String, Object> attributes = null;

            try {
                errorCode = Arrays.stream(ErrorCode.values())
                        .filter(code -> code.name().equals(enumKey))
                        .findFirst()
                        .orElse(ErrorCode.INVALID_KEY);

                var constraintViolation = fieldError.unwrap(ConstraintViolation.class);
                attributes = constraintViolation.getConstraintDescriptor().getAttributes();
            } catch (Exception e) {
            }
            String errorMessage = Objects.nonNull(attributes) ? formatMessage(errorCode.getMessage(), attributes) : errorCode.getMessage();

            errorMessage = fieldName + ": " + errorMessage;
            return  ApiResponse.builder()
                    .code(errorCode.getCode())
                    .result(errorMessage)
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("errors", errors));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ApiResponse> handleIOException(IOException exception){
        ApiResponse response = ApiResponse.builder()
                .result(ErrorCode.IO_EXCEPTION)
                .build();
        try{
            response.setResult(exception.getMessage());
        }
        catch(Exception e){}

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                response
        );
    }
    @ExceptionHandler(MultipleParameterValidationException.class)
    public ResponseEntity<Map<String, List<ApiResponse>>> handleMultipleParameterValidation(
            MultipleParameterValidationException exception) {

        List<ApiResponse> errors = exception.getMissingParameters().stream()
                .map(paramName -> {
                    ErrorCode errorCode = ErrorCode.NOT_EMPTY; // Your error code
                    String errorMessage = paramName + ": " + errorCode.getMessage();

                    return ApiResponse.builder()
                            .code(errorCode.getCode())
                            .result(errorMessage)
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("errors", errors));
    }
    private String formatMessage(String message, Map<String, Object> attributes) {
        for (Map.Entry<String, Object> entry : attributes.entrySet()) {
            message = message.replace("{" + entry.getKey() + "}", entry.getValue().toString());
        }
        return message;
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException (AppException exception){
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = AuthenticationServiceException.class)
    ResponseEntity<ApiResponse> AuthenticationExceptionHandling(AuthenticationServiceException exception){
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        ApiResponse apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
    }
}



