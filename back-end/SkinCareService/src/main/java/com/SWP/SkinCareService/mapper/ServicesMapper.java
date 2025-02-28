package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Services.ServicesRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesUpdateRequest;
import com.SWP.SkinCareService.dto.response.Services.ServicesResponse;
import com.SWP.SkinCareService.entity.Services;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServicesMapper {
    @Mapping(target = "serviceCategory", ignore = true)
    Services toServices(ServicesRequest request);

    @Mapping(target ="description", source ="serviceInfo.description")
    @Mapping(target ="img",source = "serviceInfo.serviceImgUrl")
    ServicesResponse toResponse(Services service);

    @Mapping(target = "serviceCategory", ignore = true)
    void update(ServicesUpdateRequest request,@MappingTarget Services service);
}
