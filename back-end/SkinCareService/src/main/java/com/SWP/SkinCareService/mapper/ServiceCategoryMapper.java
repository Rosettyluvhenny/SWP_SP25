package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.service.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.service.ServiceCategoryResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServiceCategoryMapper {
    ServiceCategory toServiceCategory(ServiceCategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quiz", ignore = true)
    @Mapping(target = "serviceList", ignore = true)
    void updateServiceCategory(@MappingTarget ServiceCategory serviceCategory, ServiceCategoryRequest request);

    ServiceCategoryResponse toServiceCategoryResponse(ServiceCategory serviceCategory);
}
