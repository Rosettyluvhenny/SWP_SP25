package com.SWP.SkinCareService.dto.response.Receipt;

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
    String customerName;

    String paymentMethod;
    PaymentType paymentType;
    String url;
    String staffName;
}
