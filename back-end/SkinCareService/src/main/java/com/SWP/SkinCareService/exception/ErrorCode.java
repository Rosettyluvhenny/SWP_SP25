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
    USERNAME_INVALID(1002, "Username must be at least {min} characters ",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "Password must be at least {min} characters ",HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1004,"Email must be in the right format", HttpStatus.BAD_REQUEST),
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
    MAX(2025, "The value must be at most {value}", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED(1019, "Service category existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1020, "Service category not found", HttpStatus.NOT_FOUND),
    SERVICE_EXIST(1021, "Service existed", HttpStatus.BAD_REQUEST),
    SERVICE_NOT_EXISTED(1022, "Service not found", HttpStatus.BAD_REQUEST),
    ACTIVATED(1023, "Is activate already",HttpStatus.BAD_REQUEST),
    DEACTIVATED(1024, "Is deactivated already",HttpStatus.BAD_REQUEST),
    SERVICE_INFO_NOT_FOUND(1025, "Service Information not found", HttpStatus.BAD_REQUEST),
    IO_EXCEPTION(1026, "Failed to upload image", HttpStatus.BAD_REQUEST),
    RESULT_NOT_EXISTED(1027, "Result not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_EXISTED(1028, "Room not found", HttpStatus.NOT_FOUND),
    STAFF_NOT_EXISTED(1029, "Staff not found", HttpStatus.NOT_FOUND),
    BOOKING_NOT_EXISTED(1030, "Booking not found", HttpStatus.NOT_FOUND),
    SESSION_NOT_EXISTED(1031, "Session not found", HttpStatus.NOT_FOUND),
    ANSWER_EXISTED(1032, "Answer existed", HttpStatus.BAD_REQUEST),
    QUESTION_EXISTED(1033, "Question existed", HttpStatus.BAD_REQUEST),
    QUIZ_EXISTED(1034, "Quiz existed", HttpStatus.BAD_REQUEST),
    BOOKING_ON_GOING(1035, "Your booking are ongoing", HttpStatus.BAD_REQUEST),
    THERAPIST_NOT_AVAILABLE(1036, "Therapist not available at this time", HttpStatus.BAD_REQUEST),
    RESULT_EXISTED(1037, "Result existed", HttpStatus.BAD_REQUEST),
    PAYMENT_NOT_EXISTED(1038,"Payment method not existed" , HttpStatus.BAD_REQUEST ),
    USERNAME_EXISTED(1039, "User name is existed" , HttpStatus.BAD_REQUEST ),
    IMAGE_UPLOAD_FAILED(1040, "Failed to upload image", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS(1041, "You are not authorized to modify this blog post", HttpStatus.FORBIDDEN),
    BLOGPOST_ALREADY_APPROVED(1042, "Blog post is already approved", HttpStatus.BAD_REQUEST),
    BLOGPOST_NOT_EXISTED(1043, "Blog post does not exist", HttpStatus.NOT_FOUND),
    EMAIL_EXISTED(1044,"Email is existed", HttpStatus.BAD_REQUEST),
    BOOKING_DATE_NOT_ALLOWED(1045,"You are not allowed to book a treatment service while you're in the recovery period of another treatment or having uncompleted treatment service", HttpStatus.BAD_REQUEST),
    UPDATE_NOT_ALLOWED(1046,"Update is not allowed", HttpStatus.BAD_REQUEST),
    FEEDBACK_NOT_FOUND(1047,"Feedback not found", HttpStatus.NOT_FOUND),
    OUT_OF_THERAPIST(1048,"There are no available therapists at the moment.", HttpStatus.BAD_REQUEST),
    ROOM_IN_USE(1049, "Room is in use and cannot be deleted", HttpStatus.BAD_REQUEST),
    ROOM_FULL(1050, "Room is at full capacity", HttpStatus.BAD_REQUEST),
    ROOM_EMPTY(1051, "Room is already empty", HttpStatus.BAD_REQUEST),
    ROOM_EXISTED(1052, "Room already exists", HttpStatus.BAD_REQUEST),
    SERVICE_ALREADY_EXISTS(1053,"Service is assign to the room already" ,HttpStatus.BAD_REQUEST ),
    OUT_OF_ROOM(1054, "There are no available rooms at the moment", HttpStatus.NOT_FOUND),
    SESSION_STATUS_INVALID(1055, "Session status not existed" , HttpStatus.BAD_REQUEST ),
    BOOKING_STATUS_INVALID(1056, "Booking status not existed" , HttpStatus.BAD_REQUEST ),
    PAYMENT_STATUS_INVALID(1057, "Payment status not existed" , HttpStatus.BAD_REQUEST ),
    THERAPIST_NOT_SUPPORTED(1058, "Therapist is not supported", HttpStatus.BAD_REQUEST),
    MAX_SESSION_REACHED(1059,"This service has reached the maximum number of sessions allowed.", HttpStatus.BAD_REQUEST),
    BOOKING_REJECTED(1060,"Booking rejected", HttpStatus.BAD_REQUEST),
    CURRENT_SESSION_NOT_COMPLETED(1061,"Current session is not completed or is rated or ready", HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_FOUND(1062,"Notification not found", HttpStatus.NOT_FOUND),
    NOT_HAVE_PERMISSIONS(1063,"You does not have permissions", HttpStatus.BAD_REQUEST),
    SESSION_ON_GOING(1064,"The session is on going, can't cancel", HttpStatus.BAD_REQUEST),
    PAYMENT_REQUEST_REJECTED(1065,"Payment request rejected", HttpStatus.BAD_REQUEST),
    THERAPIST_INACTIVE(1066,"Therapist is inactive", HttpStatus.BAD_REQUEST),
    RECEIPT_NOT_FOUND(1067,"Receipt not found", HttpStatus.NOT_FOUND),
    THERAPIST_CURRENT_IN_SESSION(1068,"Therapist is currently in session", HttpStatus.BAD_REQUEST),
    SERVICE_ON_GOING(1069,"Service is on going, can't remove", HttpStatus.BAD_REQUEST),
    MISSING_IMAGE(1070,"Missing image", HttpStatus.BAD_REQUEST),
    BOOKING_ALREADY_PAID(1071,"Booking already paid", HttpStatus.BAD_REQUEST),
    SPAM_REJECTED(1072,"Spam rejected, try again later", HttpStatus.BAD_REQUEST),
    CATEGORY_CANNOT_DELETE(1073,"Category cannot delete", HttpStatus.BAD_REQUEST),
    // VNPay Error Codes
    VNPAY_PAYMENT_ERROR(2000, "Lỗi trong quá trình tạo URL thanh toán VNPay", HttpStatus.INTERNAL_SERVER_ERROR),
    VNPAY_INVALID_AMOUNT(2001, "Số tiền thanh toán không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_ORDER_INFO(2002, "Thông tin đơn hàng không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_IP_ADDRESS(2003, "Không thể xác định địa chỉ IP", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_CHECKSUM(2004, "Chữ ký không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_PAYMENT_FAILED(2005, "Thanh toán thất bại", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_RESPONSE(2006, "Phản hồi từ VNPay không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_MISSING_PARAMS(2007, "Thiếu thông tin thanh toán", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(2008,"Phone number has been used" , HttpStatus.BAD_REQUEST ),
    BLOGPOST_NOT_APPROVED(2009, "Blog post is not approved yet" , HttpStatus.BAD_REQUEST ),
    IS_DEFAULT_BLOG(2010, "The Blog post is default Blog" , HttpStatus.BAD_REQUEST ),
    BOOKING_IS_COMPLETED(2011,"This service is completed, select other service" , HttpStatus.BAD_REQUEST),
    NOT_FINISH(2012,"The session is update completely" , HttpStatus.BAD_REQUEST ),
    SESSION_COMPLETED(2014,"Can't update completed Session" , HttpStatus.BAD_REQUEST ),
    ACTIVE_EXCEPTION(2015,"The active state is already change" , HttpStatus.BAD_REQUEST ),
    IS_DISABLE(2016, "Your account is disabled please contact our center directly" , HttpStatus.BAD_REQUEST ),
    WRONG_PASSWORD(2017, "Your current password is not correct. Please try again" , HttpStatus.BAD_REQUEST),
    INVALID_EXPERIENCE_YEARS(2018, "Experience year invalid" , HttpStatus.BAD_REQUEST ),
    LETTER_ONLY(2019, "Only letters are allow in this input", HttpStatus.BAD_REQUEST),
    BOOKING_IS_SOON_IN_TIME(2020, "Your booking is too soon to check in" , HttpStatus.BAD_REQUEST ),
    BOOKING_IS_LATE_IN_TIME(2021, "Your booking is too late to check in" , HttpStatus.BAD_REQUEST ),
    RATED_ALREADY(2022, "Session has been rated" , HttpStatus.BAD_REQUEST ),
    FEEDBACK_OUT_OF_TIME(2023, "Feedback time is over", HttpStatus.BAD_REQUEST),
    BOOKING_DATE_NOT_EXCEPTION(2024, "You can book the same service the same day" , HttpStatus.BAD_REQUEST ),
    CANT_CANCEL(2025, "Bạn không thể hủy buổi hẹn đã hoàn thành hoặc đang diễn ra" , HttpStatus.BAD_REQUEST );
    ;


    int code;
    String message;
    HttpStatusCode httpStatusCode;
}
