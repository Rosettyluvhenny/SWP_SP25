package com.SWP.SkinCareService.dto.response.basicDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptDTO {
    int id;
    LocalDateTime date;
    BigDecimal amount;
    String serviceName;
    String customerName;
    String paymentMethod;
    String paymentType;
    String url;
    String staffName;
}
