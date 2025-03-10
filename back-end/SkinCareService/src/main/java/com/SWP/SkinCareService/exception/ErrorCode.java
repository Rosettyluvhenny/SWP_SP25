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
    USERNAME_INVALID(1003, "Username must be at least {min} characters ",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least {min} characters ",HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1005,"Email must be in the right format", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1005, "Invalid message key",HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1006,"User not found",HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1007, "Unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1009, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1010, "Role not found", HttpStatus.NOT_FOUND),
    PHONE_NO_INVALID(1011, "Phone no must contain 10 digit",HttpStatus.BAD_REQUEST),
    QUIZ_NOT_EXISTED(1012, "Quiz not found", HttpStatus.NOT_FOUND),
    QUESTION_NOT_EXISTED(1013, "Question not found", HttpStatus.NOT_FOUND),
    ANSWER_NOT_EXISTED(1014, "Answer not found", HttpStatus.NOT_FOUND),
    NOT_EMPTY (1015, "This field can not be empty",HttpStatus.BAD_REQUEST),
    THERAPIST_NOT_EXISTED(1016, "Therapist not found", HttpStatus.NOT_FOUND),
    STILL_ACTIVE(1017,"The active entity can not be deleted", HttpStatus.BAD_REQUEST),
    MIN(1018, "The value must be at least {value}", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED(1019, "Service category existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1020, "Service category not found", HttpStatus.NOT_FOUND),
    SERVICE_EXIST(1021, "Service existed", HttpStatus.BAD_REQUEST),
    SERVICE_NOT_EXISTED(1022, "Service not found", HttpStatus.BAD_REQUEST),
    ACTIVATED(1023, "Is activate already",HttpStatus.BAD_REQUEST),
    DEACTIVATED(1023, "Is deactivated already",HttpStatus.BAD_REQUEST),
    SERVICE_INFO_NOT_FOUND(1024, "Service Information not found", HttpStatus.BAD_REQUEST),
    IO_EXCEPTION(1025, "Failed to upload image", HttpStatus.BAD_REQUEST),
    RESULT_NOT_EXISTED(1029, "Result not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_EXISTED(1031, "Room not found", HttpStatus.NOT_FOUND),
    STAFF_NOT_EXISTED(1032, "Staff not found", HttpStatus.NOT_FOUND),
    BOOKING_NOT_EXISTED(1034, "Booking not found", HttpStatus.NOT_FOUND),
    SESSION_NOT_EXISTED(1035, "Session not found", HttpStatus.NOT_FOUND),
    ANSWER_EXISTED(1036, "Answer existed", HttpStatus.BAD_REQUEST),
    QUESTION_EXISTED(1037, "Question existed", HttpStatus.BAD_REQUEST),
    QUIZ_EXISTED(1038, "Quiz existed", HttpStatus.BAD_REQUEST),
    BOOKING_ON_GOING(1040, "Your booking are ongoing", HttpStatus.BAD_REQUEST),
    THERAPIST_NOT_AVAILABLE(1041, "Therapist not available at this time", HttpStatus.BAD_REQUEST),
    RESULT_EXISTED(1043, "Result existed", HttpStatus.BAD_REQUEST),
    PAYMENT_NOT_EXISTED(1044,"Payment method not existed" , HttpStatus.BAD_REQUEST ),
    USERNAME_EXISTED(1045, "User name is existed" , HttpStatus.BAD_REQUEST ),
    IMAGE_UPLOAD_FAILED(1032, "Failed to upload image", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS(1034, "You are not authorized to modify this blog post", HttpStatus.FORBIDDEN),
    BLOGPOST_ALREADY_APPROVED(1033, "Blog post is already approved", HttpStatus.BAD_REQUEST),
    BLOGPOST_NOT_EXISTED(1030, "Blog post does not exist", HttpStatus.NOT_FOUND),
    EMAIL_EXISTED(1029,"Email is existed", HttpStatus.BAD_REQUEST),
    BOOKING_DATE_NOT_ALLOWED(1031,"Booking date is not allowed", HttpStatus.BAD_REQUEST),
    UPDATE_NOT_ALLOWED(1032,"Update is not allowed", HttpStatus.BAD_REQUEST),
    //---------- ADD
    FEEDBACK_NOT_FOUND(1033,"Feedback not found", HttpStatus.NOT_FOUND),
    OUT_OF_THERAPIST(1034,"There are no available therapists at the moment.", HttpStatus.BAD_REQUEST),
    //Merge
    ROOM_IN_USE(1032, "Room is in use and cannot be deleted", HttpStatus.BAD_REQUEST),
    ROOM_FULL(1033, "Room is at full capacity", HttpStatus.BAD_REQUEST),
    ROOM_EMPTY(1034, "Room is already empty", HttpStatus.BAD_REQUEST),
    ROOM_EXISTED(1030, "Room already exists", HttpStatus.BAD_REQUEST),
    SERVICE_ALREADY_EXISTS(1043,"Service is assign to the room already" ,HttpStatus.BAD_REQUEST ),
    OUT_OF_ROOM(1034, "There are no available rooms at the moment", HttpStatus.NOT_FOUND),
    SESSION_STATUS_INVALID(1059, "Session status not existed" , HttpStatus.BAD_REQUEST ),
    BOOKING_STATUS_INVALID(1060, "Booking status not existed" , HttpStatus.BAD_REQUEST ),
    THERAPIST_NOT_SUPPORTED(1061, "Therapist is not supported", HttpStatus.BAD_REQUEST),

    ;

    int code;
    String message;
    HttpStatusCode httpStatusCode;
}
