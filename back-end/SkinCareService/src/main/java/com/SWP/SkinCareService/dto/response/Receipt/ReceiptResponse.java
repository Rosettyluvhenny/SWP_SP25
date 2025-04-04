package com.SWP.SkinCareService.dto.response.Receipt;

import com.SWP.SkinCareService.entity.Payment;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.enums.PaymentType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptResponse {
    int id;
    LocalDateTime date;
    BigDecimal amount;
    String serviceName;
    Payment payment;
    PaymentType paymentType;
    String url;
    User staff;
}
