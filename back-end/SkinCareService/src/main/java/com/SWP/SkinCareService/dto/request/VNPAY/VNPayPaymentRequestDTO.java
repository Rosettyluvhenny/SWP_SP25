package com.SWP.SkinCareService.dto.request.VNPAY;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VNPayPaymentRequestDTO {
    @NotNull(message = "Booking ID không được để trống")
    private Integer bookingId;

    private String bankCode;

    @NotNull(message = "Ngôn ngữ không được để trống")
    private String language = "vn";
}