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
    UNCATEGORIZED_EXCEPTION(1000, "Lỗi chưa được phân loại",HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1001, "Tên người dùng đã tồn tại",HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002, "Tên người dùng phải chứa ít nhất {min} kí tự ",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "Mật khẩu phải chứa ít nhất {min} kí tự ",HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1004,"Email phải đúng dạng @gmail.com", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1005, "Lỗi chưa định dạng",HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1006,"Không tìm thấy tên người dùng",HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1007, "Không có quyền truy cập, vui lòng đăng nhập",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "Không có quyền truy cập vào chức năng này", HttpStatus.FORBIDDEN),
    INVALID_DOB(1009, "Tuổi của bạn cần ít nhất {min} tuổi", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1010, "Không tìm thấy quyền hạn", HttpStatus.NOT_FOUND),
    PHONE_NO_INVALID(1011, " Số điện thoại phải chứa 10 số",HttpStatus.BAD_REQUEST),
    QUIZ_NOT_EXISTED(1012, "Không tìm thấy bài trắc nghiệm", HttpStatus.NOT_FOUND),
    QUESTION_NOT_EXISTED(1013, "Không tìm thấy câu hỏi", HttpStatus.NOT_FOUND),
    ANSWER_NOT_EXISTED(1014, "Không tìm thấy câu trả lời", HttpStatus.NOT_FOUND),
    NOT_EMPTY (1015, "Không được bỏ trống",HttpStatus.BAD_REQUEST),
    THERAPIST_NOT_EXISTED(1016, "Không tìm thấy chuyên viên", HttpStatus.NOT_FOUND),
    STILL_ACTIVE(1017,"Chuyên viên còn hoạt động không thể xóa", HttpStatus.BAD_REQUEST),
    MIN(1018, "Phải ít nhất là {value}", HttpStatus.BAD_REQUEST),
    MAX(2025, "Phải tối đa là {value}", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED(1019, "Loai dịch vụ đã tồn tại", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1020, "Loại dịch vụ không tồn tại", HttpStatus.NOT_FOUND),
    SERVICE_EXIST(1021, "Dịch vụ đã tồn tại", HttpStatus.BAD_REQUEST),
    SERVICE_NOT_EXISTED(1022, "Không tìm thấy dịch vụ", HttpStatus.BAD_REQUEST),
    ACTIVATED(1023, "Dịch vụ đã được kích hoạt",HttpStatus.BAD_REQUEST),
    DEACTIVATED(1024, "Dịch vụ đã được vô hiệu hóa",HttpStatus.BAD_REQUEST),
    SERVICE_INFO_NOT_FOUND(1025, "Không tìm thấy thông tin dịch vụ", HttpStatus.BAD_REQUEST),
    IO_EXCEPTION(1026, "Đăng ảnh thất bại", HttpStatus.BAD_REQUEST),
    RESULT_NOT_EXISTED(1027, "Không tìm thấy kết quả", HttpStatus.NOT_FOUND),
    ROOM_NOT_EXISTED(1028, "Không tìm thấy phòng", HttpStatus.NOT_FOUND),
    STAFF_NOT_EXISTED(1029, "Không tìm thấy nhân viên", HttpStatus.NOT_FOUND),
    BOOKING_NOT_EXISTED(1030, "Không tìm thấy thông tin đặt chỗ", HttpStatus.NOT_FOUND),
    SESSION_NOT_EXISTED(1031, "Không tìm thấy buổi trị liệu", HttpStatus.NOT_FOUND),
    ANSWER_EXISTED(1032, "Đáp án đã tồn tại", HttpStatus.BAD_REQUEST),
    QUESTION_EXISTED(1033, "Câu hỏi đã tồn tại", HttpStatus.BAD_REQUEST),
    QUIZ_EXISTED(1034, "Trắc nghiệm đã tồn tại", HttpStatus.BAD_REQUEST),
    BOOKING_ON_GOING(1035, "Đặt chỗ của bạn đang được xử lý", HttpStatus.BAD_REQUEST),
    THERAPIST_NOT_AVAILABLE(1036, "Chuyên viên trị liệu này không có sẵn ở thời điểm này", HttpStatus.BAD_REQUEST),
    RESULT_EXISTED(1037, "Kết quả đã tồn tại", HttpStatus.BAD_REQUEST),
    PAYMENT_NOT_EXISTED(1038,"Phương thức thanh toán không tồn tại" , HttpStatus.BAD_REQUEST ),
    USERNAME_EXISTED(1039, "Tên người dùng đã tồn tại" , HttpStatus.BAD_REQUEST ),
    IMAGE_UPLOAD_FAILED(1040, "Đăng ảnh thất bại", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS(1041, "Bạn không có quyền chỉnh sửa bài blog", HttpStatus.FORBIDDEN),
    BLOGPOST_ALREADY_APPROVED(1042, "Bài blog đã được duyệt", HttpStatus.BAD_REQUEST),
    BLOGPOST_NOT_EXISTED(1043, "Bài blog không tồn tại", HttpStatus.NOT_FOUND),
    EMAIL_EXISTED(1044,"Email đã tồn tại", HttpStatus.BAD_REQUEST),
    BOOKING_DATE_NOT_ALLOWED(1045,"Bạn không được phép đặt dịch vụ điều trị khi đang trong giai đoạn hồi phục của một dịch vụ điều trị khác hoặc có liệu trình điều trị chưa hoàn thành", HttpStatus.BAD_REQUEST),
    UPDATE_NOT_ALLOWED(1046,"Không thể thực hiện cập nhật", HttpStatus.BAD_REQUEST),
    FEEDBACK_NOT_FOUND(1047,"Không tìm thấy feedback", HttpStatus.NOT_FOUND),
    OUT_OF_THERAPIST(1048,"Không có chuyên gia trị liệu nào có sẵn vào thời điểm này. Vui lòng thử lại sau", HttpStatus.BAD_REQUEST),
    ROOM_IN_USE(1049, "Không thể xóa phòng vì đang có người sử dụng", HttpStatus.BAD_REQUEST),
    ROOM_FULL(1050, "Phòng đã không còn chỗ trống", HttpStatus.BAD_REQUEST),
    ROOM_EMPTY(1051, "Phòng đã trống", HttpStatus.BAD_REQUEST),
    ROOM_EXISTED(1052, "Phòng đã tồn tại", HttpStatus.BAD_REQUEST),
    SERVICE_ALREADY_EXISTS(1053,"Dịch vụ đã được chỉ định cho phòng này" ,HttpStatus.BAD_REQUEST ),
    OUT_OF_ROOM(1054, "Không còn phòng trống vào lúc này.", HttpStatus.NOT_FOUND),
    SESSION_STATUS_INVALID(1055, "Trạng thái buổi làm việc không tồn tại" , HttpStatus.BAD_REQUEST ),
    BOOKING_STATUS_INVALID(1056, "Trạng thái đặt chỗ không tồn tại" , HttpStatus.BAD_REQUEST ),
    PAYMENT_STATUS_INVALID(1057, "Trạng thái thanh toán không tồn tại" , HttpStatus.BAD_REQUEST ),
    THERAPIST_NOT_SUPPORTED(1058, "Chuyên gia trị liệu không khả dụng cho dịch vụ này", HttpStatus.BAD_REQUEST),
    MAX_SESSION_REACHED(1059,"Dịch vụ này đã đạt số buổi trị liệu tối đa cho phép.", HttpStatus.BAD_REQUEST),
    BOOKING_REJECTED(1060,"Đặt chỗ không được chấp nhận", HttpStatus.BAD_REQUEST),
    CURRENT_SESSION_NOT_COMPLETED(1061,"Buổi trị liệu hiện tại chưa hoàn tất hoặc đã được đánh giá", HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_FOUND(1062,"Không tìm thấy thông báo", HttpStatus.NOT_FOUND),
    NOT_HAVE_PERMISSIONS(1063,"Bạn không có quyền truy cập", HttpStatus.BAD_REQUEST),
    SESSION_ON_GOING(1064,"Buổi trị liệu này đang được diễn ra, không thể hủy", HttpStatus.BAD_REQUEST),
    PAYMENT_REQUEST_REJECTED(1065,"Yêu cầu thanh toán không được chấp nhận", HttpStatus.BAD_REQUEST),
    THERAPIST_INACTIVE(1066,"Chuyên viên trị liệu hiện không khả dụng", HttpStatus.BAD_REQUEST),
    RECEIPT_NOT_FOUND(1067,"Biên lai không tồn tại", HttpStatus.NOT_FOUND),
    THERAPIST_CURRENT_IN_SESSION(1068,"Chuyên gia trị liệu hiện đang ở trong một buổi trị liệu", HttpStatus.BAD_REQUEST),
    SERVICE_ON_GOING(1069,"Dịch vụ đang trong quá trình thực hiện, không thể gỡ bỏ", HttpStatus.BAD_REQUEST),
    MISSING_IMAGE(1070,"Hình ảnh chưa được tải lên", HttpStatus.BAD_REQUEST),
    BOOKING_ALREADY_PAID(1071,"Thông tin đặt chỗ đã được thanh toán", HttpStatus.BAD_REQUEST),
    SPAM_REJECTED(1072,"Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau.", HttpStatus.BAD_REQUEST),
    CATEGORY_CANNOT_DELETE(1073,"Không thể xóa danh mục này", HttpStatus.BAD_REQUEST),
    // VNPay Error Codes
    VNPAY_PAYMENT_ERROR(2000, "Lỗi trong quá trình tạo URL thanh toán VNPay", HttpStatus.INTERNAL_SERVER_ERROR),
    VNPAY_INVALID_AMOUNT(2001, "Số tiền thanh toán không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_ORDER_INFO(2002, "Thông tin đơn hàng không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_IP_ADDRESS(2003, "Không thể xác định địa chỉ IP", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_CHECKSUM(2004, "Chữ ký không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_PAYMENT_FAILED(2005, "Thanh toán thất bại", HttpStatus.BAD_REQUEST),
    VNPAY_INVALID_RESPONSE(2006, "Phản hồi từ VNPay không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_MISSING_PARAMS(2007, "Thiếu thông tin thanh toán", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(2008,"Số điện thoại đã được sử dụng" , HttpStatus.BAD_REQUEST ),
    BLOGPOST_NOT_APPROVED(2009, "Bài blog chưa được phê duyệt" , HttpStatus.BAD_REQUEST ),
    IS_DEFAULT_BLOG(2010, "Bài viết này được đặt làm blog mặc định" , HttpStatus.BAD_REQUEST ),
    BOOKING_IS_COMPLETED(2011,"Dịch vụ này đã hoàn thành, vui lòng chọn dịch vụ khác" , HttpStatus.BAD_REQUEST),
    NOT_FINISH(2012,"Cập nhật buổi trị liệu thành công" , HttpStatus.BAD_REQUEST ),
    SESSION_COMPLETED(2014,"Không thể cập nhật buổi trị liệu đã hoàn thành" , HttpStatus.BAD_REQUEST ),
    ACTIVE_EXCEPTION(2015,"Trạng thái hoạt động đã được kích hoạt" , HttpStatus.BAD_REQUEST ),
    IS_DISABLE(2016, "Tài khoản của bạn đã bị khóa, vui lòng liên hệ trung tâm để được hỗ trợ" , HttpStatus.BAD_REQUEST ),
    WRONG_PASSWORD(2017, "Mật khẩu bạn nhập không chính xác. Vui lòng thử lại" , HttpStatus.BAD_REQUEST),
    INVALID_EXPERIENCE_YEARS(2018, "Số năm kinh nghiệm không hợp lệ" , HttpStatus.BAD_REQUEST ),
    LETTER_ONLY(2019, "Chỉ có thể nhập chữ cái, vui lòng kiểm tra lại", HttpStatus.BAD_REQUEST),
    BOOKING_IS_SOON_IN_TIME(2020, "Đặt chỗ của bạn quá sớm để check in" , HttpStatus.BAD_REQUEST ),
    BOOKING_IS_LATE_IN_TIME(2021, "Đặt chỗ của bạn quá trễ để check in" , HttpStatus.BAD_REQUEST ),
    RATED_ALREADY(2022, "Buổi trị liệu đã được đánh giá" , HttpStatus.BAD_REQUEST ),
    FEEDBACK_OUT_OF_TIME(2023, "Thời gian đánh giá đã hết hạn", HttpStatus.BAD_REQUEST),
    BOOKING_DATE_NOT_EXCEPTION(2024, "Không cho phép đặt cùng một dịch vụ trong cùng một ngày" , HttpStatus.BAD_REQUEST ),
    CANT_CANCEL(2025, "Bạn không thể hủy buổi hẹn đã hoàn thành hoặc đang diễn ra", HttpStatus.BAD_REQUEST);
    ;


    int code;
    String message;
    HttpStatusCode httpStatusCode;
}