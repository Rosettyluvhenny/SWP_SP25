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
    CATEGORY_EXIST(1019, "Service category existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1020, "Service category not found", HttpStatus.NOT_FOUND),
    SERVICE_EXIST(1021, "Service existed", HttpStatus.BAD_REQUEST),
    SERVICE_NOT_EXISTED(1022, "Service not found", HttpStatus.BAD_REQUEST),
    ACTIVATED(1023, "Is activate already",HttpStatus.BAD_REQUEST),
    DEACTIVATED(1023, "Is deactivated already",HttpStatus.BAD_REQUEST),
    SERVICE_INFO_NOT_FOUND(1024, "Service Infomation not found", HttpStatus.BAD_REQUEST),
    IO_EXCEPTION(1025, "Failed to upload image", HttpStatus.BAD_REQUEST),
    PAYMENT_NOT_EXISTED(1026,"Payment method not existed" , HttpStatus.BAD_REQUEST ),
    BOOKING_NOT_EXISTED(1027, "Booking not existed", HttpStatus.BAD_REQUEST ),
    USERNAME_EXISTED(1028, "User name is existed" , HttpStatus.BAD_REQUEST ),
    EMAIL_EXISTED(1029,"Email is existed", HttpStatus.BAD_REQUEST),
    PHONE_NOT_EXISTED(1030, "Phone number not found", HttpStatus.BAD_REQUEST ),
    PHONE_EXISTED(1031,"Phone existed" ,HttpStatus.BAD_REQUEST ),
    INVALID_STATUS(1032,"Status not existed" , HttpStatus.BAD_REQUEST ),
    SESSION_NOT_EXISTED(1034,"Session is cancelled or not exist" , HttpStatus.BAD_REQUEST ),
    ROOM_EXISTED(1030, "Room already exists", HttpStatus.BAD_REQUEST),
    ROOM_NOT_EXISTED(1031, "Room not found", HttpStatus.NOT_FOUND),
    ROOM_IN_USE(1032, "Room is in use and cannot be deleted", HttpStatus.BAD_REQUEST),
    ROOM_FULL(1033, "Room is at full capacity", HttpStatus.BAD_REQUEST),
    ROOM_EMPTY(1034, "Room is already empty", HttpStatus.BAD_REQUEST),
    ROOM_SERVICE_EXISTED(1040, "Room service already exists", HttpStatus.BAD_REQUEST),
    ROOM_SERVICE_NOT_EXISTED(1041, "Room service not found", HttpStatus.NOT_FOUND),
    ROOM_SERVICE_IN_USE(1042, "Room service is in use and cannot be deleted", HttpStatus.BAD_REQUEST),
    SERVICE_ALREADY_EXISTS(1043,"Service is assign to the room already" ,HttpStatus.BAD_REQUEST ),
    LETTER_ONLY(1044, "Fullname only contains letter", HttpStatus.BAD_REQUEST),
    RESULT_NOT_EXISTED(1045, "Result not found", HttpStatus.NOT_FOUND),
    STAFF_NOT_EXISTED(1046, "Staff not found", HttpStatus.NOT_FOUND),
    ANSWER_EXISTED(1047, "Answer existed", HttpStatus.BAD_REQUEST),
    QUESTION_EXISTED(1048, "Question existed", HttpStatus.BAD_REQUEST),
    QUIZ_EXISTED(1049, "Quiz existed", HttpStatus.BAD_REQUEST),
    BOOKING_ON_GOING(1050, "Your booking are ongoing", HttpStatus.BAD_REQUEST),
    THERAPIST_NOT_AVAILABLE(1051, "Therapist not available at this time", HttpStatus.BAD_REQUEST),
    ROOM_NOT_AVAILABLE(1052, "Room not available at this time", HttpStatus.BAD_REQUEST),
    RESULT_EXISTED(1053, "Result existed", HttpStatus.BAD_REQUEST),
    IMAGE_UPLOAD_FAILED(1054, "Failed to upload image", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS(1055, "You are not authorized to modify this blog post", HttpStatus.FORBIDDEN),
    BLOGPOST_ALREADY_APPROVED(1056, "Blog post is already approved", HttpStatus.BAD_REQUEST),
    BLOGPOST_NOT_EXISTED(1057, "Blog post does not exist", HttpStatus.NOT_FOUND),
    BOOKING_DATE_NOT_ALLOWED(1058,"Booking date is not allowed", HttpStatus.BAD_REQUEST),
    SESSION_STATUS_INVALID(1059, "Session status not existed" , HttpStatus.BAD_REQUEST ),
    BOOKING_STATUS_INVALID(1060, "Booking status not existed" , HttpStatus.BAD_REQUEST ),
    THERAPIST_SERVICE_INVALID(1061,"The therapist you chose is unable to serve this service" , HttpStatus.BAD_REQUEST);

    int code;
    String message;
    HttpStatusCode httpStatusCode;
}
