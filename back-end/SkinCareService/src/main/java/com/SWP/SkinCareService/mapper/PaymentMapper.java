package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Payment.PaymentRequest;
import com.SWP.SkinCareService.dto.response.Payment.PaymentResponse;
import com.SWP.SkinCareService.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    Payment toPayment(PaymentRequest request);

    PaymentResponse toPaymentResponse(Payment payment);

    void updatePayment(@MappingTarget Payment payment, PaymentRequest request);
} 