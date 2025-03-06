package com.SWP.SkinCareService.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingUpdateRequest {
    String userId;
    int serviceId;
    String status;
    String paymentStatus;
    int paymentId;
    String notes;
    int sessionRemain;
    String staffId;
    //int price;
}
