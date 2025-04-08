package com.SWP.SkinCareService.dto.response.Payment;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    int paymentId;
    String paymentName;
    boolean status;
} 