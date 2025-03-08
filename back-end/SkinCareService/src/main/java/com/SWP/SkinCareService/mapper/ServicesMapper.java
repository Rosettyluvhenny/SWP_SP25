package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Services.ServicesRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesUpdateRequest;
import com.SWP.SkinCareService.dto.response.Services.ServiceSummaryResponse;
import com.SWP.SkinCareService.dto.response.Services.ServicesResponse;
import com.SWP.SkinCareService.entity.Services;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServicesMapper {
    @Mapping(target = "serviceCategory", ignore = true)
    Services toServices(ServicesRequest request);

    @Mapping(target = "categoryName", source = "serviceCategory.name")
    @Mapping(target = "categoryId", source = "serviceCategory.id")
    ServicesResponse toResponse(Services service);

    @Mapping(target = "serviceCategory", ignore = true)
    void update(ServicesUpdateRequest request,@MappingTarget Services service);

    ServiceSummaryResponse toSummaryResponse(Services services);
}
