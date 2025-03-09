package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Services.CategoryUpdateRequest;
import com.SWP.SkinCareService.dto.request.Services.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.Services.ServiceCategoryResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServiceCategoryMapper {

    ServiceCategoryResponse toResponse(ServiceCategory serviceCategory);

    ServiceCategory toCategory(ServiceCategoryRequest request);

    void update(@MappingTarget ServiceCategory category, CategoryUpdateRequest request);
}
