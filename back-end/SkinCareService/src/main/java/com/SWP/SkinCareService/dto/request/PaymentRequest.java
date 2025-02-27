package com.SWP.SkinCareService.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentRequest {

    @NotBlank(message = "Tên phương thức thanh toán không được để trống!")
    String paymentName;
}
