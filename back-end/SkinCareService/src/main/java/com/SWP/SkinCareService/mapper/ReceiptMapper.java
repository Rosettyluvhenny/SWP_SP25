package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.response.Receipt.ReceiptResponse;
import com.SWP.SkinCareService.entity.Receipt;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReceiptMapper {
    @Mapping(target = "paymentMethod", source = "payment.paymentName")
    @Mapping(target = "staffName", source = "staff.fullName")
    ReceiptResponse toResponse(Receipt receipt);

}