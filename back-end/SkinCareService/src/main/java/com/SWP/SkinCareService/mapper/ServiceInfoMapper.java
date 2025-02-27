package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.response.Services.ServiceInfoResponse;
import com.SWP.SkinCareService.entity.ServiceInfo;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServiceInfoMapper {

    ServiceInfoResponse toResponse(ServiceInfo info);
}
