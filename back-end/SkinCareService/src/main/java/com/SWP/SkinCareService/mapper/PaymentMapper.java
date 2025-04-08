package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Payment.PaymentRequest;
import com.SWP.SkinCareService.dto.response.Payment.PaymentResponse;
import com.SWP.SkinCareService.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    Payment toPayment(PaymentRequest request);

    @Mapping(target = "status", source = "status")
    PaymentResponse toPaymentResponse(Payment payment);

    void updatePayment(@MappingTarget Payment payment, PaymentRequest request);
} 