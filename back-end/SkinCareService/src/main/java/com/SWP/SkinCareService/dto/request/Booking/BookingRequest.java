package com.SWP.SkinCareService.dto.request.Booking;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    String userId;
    int serviceId;
    int paymentId;
    String notes;
    //int sessionRemain;
    //String staffId; //null luc tao
    //int price;
    LocalDateTime bookingTime;
    String therapistId;

    //Update status only -> BookingUpdateRequest
    //Enum cho feedback object
    //Dieu tri la cach 1 tuan duoc book, cham soc la luc nao cung duoc
    //Ket thuc dieu tri duoc dung cham soc, chua ket thuc ko duoc
    //
    //Neu ss Remain = service.session -> complete method rieng
    /*
    1 endpoint cho bookSS: assign staffId -> Springs security de luu staffID -> assign staffId nay

    1 endpoint doi trang thai thanh success: check tat ca field ko null -> duoc quyen complete

    CRUD feedback

    Session complete -> feedback repo auto tạo 1 feedback trong sessionService, rate is False auto hiện để khách hàng làm feedback

    thêm field rating cho Service

    mỗi lần cập nật trạng thái feedback, inject service repo vào, tính trung bình các feed back 0.5

    nhét therapistID vào feedback, ấy từ bookSession, làm giống user feedback

    Dũng:
    + blog: tạo endpoint findByApproveFalse
    +
     */

}
