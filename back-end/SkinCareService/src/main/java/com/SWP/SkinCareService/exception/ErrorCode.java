package com.SWP.SkinCareService.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized Error",HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1001, "User Existed",HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 5 characters ",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least 8 characters ",HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1005,"Email must be in the right format", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1005, "Invalid message key",HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1006,"User not found",HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1007, "Unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1009, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    SERVICE_CATEGORY_NOT_EXISTED(1010, "Service category Not Existed",HttpStatus.NOT_FOUND),
    QUIZ_NOT_EXISTED(1011, "quiz not found", HttpStatus.NOT_FOUND),
    QUESTION_NOT_EXISTED(1012, "Question not found", HttpStatus.NOT_FOUND),
    ANSWER_NOT_EXISTED(1013, "Answer not found", HttpStatus.NOT_FOUND),
    RESULT_NOT_EXISTED(1014, "Result not found", HttpStatus.NOT_FOUND),
    SERVICE_NOT_EXISTED(1015, "Service not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_EXISTED(1016, "Room not found", HttpStatus.NOT_FOUND),
    STAFF_NOT_EXISTED(1017, "Staff not found", HttpStatus.NOT_FOUND),
    PAYMENT_METHOD_NOT_EXISTED(1018, "Payment method not found", HttpStatus.NOT_FOUND),
    BOOKING_NOT_EXISTED(1019, "Booking not found", HttpStatus.NOT_FOUND),
    SESSION_NOT_EXISTED(1020, "Session not found", HttpStatus.NOT_FOUND),
    ;
    int code;
    String message;
    HttpStatusCode httpStatusCode;
}
