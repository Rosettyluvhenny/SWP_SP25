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
    BLOGPOST_NOT_EXISTED(1030, "Blog post does not exist", HttpStatus.NOT_FOUND),
    BLOGPOST_ALREADY_APPROVED(1033, "Blog post is already approved", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS(1034, "You are not authorized to modify this blog post", HttpStatus.FORBIDDEN),
    ROOM_NOT_EXISTED(1031, "Room does not exist", HttpStatus.NOT_FOUND),
    IMAGE_UPLOAD_FAILED(1032, "Failed to upload image", HttpStatus.BAD_REQUEST),

    // VNPay Error Codes
    VNPAY_PAYMENT_ERROR(2000, "Lỗi trong quá trình tạo URL thanh toán VNPay", HttpStatus.INTERNAL_SERVER_ERROR),
    VNPAY_INVALID_AMOUNT(2001, "Số tiền thanh toán không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_ORDER_INFO(2002, "Thông tin đơn hàng không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_IP_ADDRESS(2003, "Không thể xác định địa chỉ IP", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_CHECKSUM(2004, "Chữ ký không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_PAYMENT_FAILED(2005, "Thanh toán thất bại", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_RESPONSE(2006, "Phản hồi từ VNPay không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_MISSING_PARAMS(2007, "Thiếu thông tin thanh toán", HttpStatus.BAD_REQUEST);

    int code;
    String message;
    HttpStatusCode httpStatusCode;
}
