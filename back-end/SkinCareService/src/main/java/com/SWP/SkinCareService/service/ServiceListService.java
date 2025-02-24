package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.ServiceRequest;
import com.SWP.SkinCareService.dto.response.ServiceResponse;
import com.SWP.SkinCareService.entity.ServiceList;
import com.SWP.SkinCareService.repository.ServiceListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceListService {
    private final ServiceListRepository serviceRepository;

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
        return serviceRepository.findById(id)
                .map(existingService -> {
                    existingService.setServiceName(request.getServiceName());
                    existingService.setCategoryId(request.getCategoryId());
                    existingService.setSubTitle(request.getSubTitle());
                    existingService.setDescription(request.getDescription());
                    existingService.setPrice(request.getPrice());
                    existingService.setDurationMinutes(request.getDurationMinutes());
                    existingService.setSession(request.getSession());
                    existingService.setStatus(request.getStatus());
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
                .categoryId(service.getCategoryId())
                .subTitle(service.getSubTitle())
                .description(service.getDescription())
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .session(service.getSession())
                .status(service.getStatus())
                .build();
    }

    // Chuyển đổi từ request DTO -> entity
    private ServiceList convertToEntity(ServiceRequest request) {
        return ServiceList.builder()
                .serviceName(request.getServiceName())
                .categoryId(request.getCategoryId())
                .subTitle(request.getSubTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .session(request.getSession())
                .status(request.getStatus())
                .build();
    }
}