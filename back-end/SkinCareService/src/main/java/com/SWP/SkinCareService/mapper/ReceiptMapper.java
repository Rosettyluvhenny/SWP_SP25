package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.response.Receipt.ReceiptResponse;
import com.SWP.SkinCareService.entity.Receipt;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReceiptMapper {

    ReceiptResponse toResponse(Receipt receipt);

}