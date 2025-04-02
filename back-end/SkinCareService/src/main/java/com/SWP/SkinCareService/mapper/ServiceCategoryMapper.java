package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Services.CategoryUpdateRequest;
import com.SWP.SkinCareService.dto.request.Services.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.Services.ServiceCategoryResponse;
import com.SWP.SkinCareService.dto.response.basicDTO.ServiceDTO;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.Services;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServiceCategoryMapper {

    //@Mapping(target = "services", expression = "java(toServiceDTOList(serviceCategory.getServices()))")
    ServiceCategoryResponse toResponse(ServiceCategory serviceCategory);

    ServiceCategory toCategory(ServiceCategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quiz", ignore = true)
    @Mapping(target = "services", ignore = true)
    void update(@MappingTarget ServiceCategory serviceCategory, CategoryUpdateRequest request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "duration", source = "duration")
    @Mapping(target = "session", source = "session")
    @Mapping(target = "img", source = "img")
    @Mapping(target = "description", source = "description")
    ServiceDTO toServiceDTO(Services service);

    List<ServiceDTO> toServiceDTOList(List<Services> services);

}
