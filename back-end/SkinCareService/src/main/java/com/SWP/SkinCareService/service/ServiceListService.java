package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.ServiceRequest;
import com.SWP.SkinCareService.dto.response.ServiceResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.ServiceList;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import com.SWP.SkinCareService.repository.ServiceListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceListService {
    private final ServiceListRepository serviceRepository;
    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ServiceResponse getServiceById(Long id) {
        return serviceRepository.findById(id)
                .map(this::convertToResponse)
                .orElse(null);
    }

    public ServiceResponse createService(ServiceRequest request) {
        ServiceList service = convertToEntity(request);
        return convertToResponse(serviceRepository.save(service));
    }

    public ServiceResponse updateServiceById(Long id, ServiceRequest request) {
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(request.getCategoryId()).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        return serviceRepository.findById(id)
                .map(existingService -> {
                    existingService.setServiceName(request.getServiceName());
                    existingService.setSubTitle(request.getSubTitle());
                    existingService.setDescription(request.getDescription());
                    existingService.setPrice(request.getPrice());
                    existingService.setDurationMinutes(request.getDurationMinutes());
                    existingService.setSession(request.getSession());
                    existingService.setStatus(request.getStatus());


                    existingService.setServiceCategory(serviceCategory);


                    return convertToResponse(serviceRepository.save(existingService));
                })
                .orElse(null);
    }

    public boolean deleteServiceById(Long id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Chuyển đổi từ entity -> response DTO
    private ServiceResponse convertToResponse(ServiceList service) {

        return ServiceResponse.builder()
                .serviceId(service.getServiceId())
                .serviceName(service.getServiceName())
                .subTitle(service.getSubTitle())
                .description(service.getDescription())
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .session(service.getSession())
                .status(service.getStatus())
                .serviceCategory(service.getServiceCategory())
                .build();
    }

    // Chuyển đổi từ request DTO -> entity
    private ServiceList convertToEntity(ServiceRequest request) {
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(request.getCategoryId()).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        return ServiceList.builder()
                .serviceName(request.getServiceName())
                .subTitle(request.getSubTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .session(request.getSession())
                .status(request.getStatus())
                .serviceCategory(serviceCategory)
                .build();
    }
}