package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.service.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.service.ServiceCategoryResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.ServiceCategoryMapper;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ServiceCategoryService {
    private ServiceCategoryRepository serviceCategoryRepository;

    private ServiceCategoryMapper serviceCategoryMapper;

    @Transactional
    public ServiceCategoryResponse createServiceCategory(ServiceCategoryRequest request) {
        ServiceCategory serviceCategory = serviceCategoryMapper.toServiceCategory(request);
        serviceCategoryRepository.save(serviceCategory);
        return serviceCategoryMapper.toServiceCategoryResponse(serviceCategory);
    }

    public List<ServiceCategoryResponse> getAllServiceCategory() {
        return serviceCategoryRepository.findAll()
                .stream()
                .map(serviceCategoryMapper::toServiceCategoryResponse)
                .toList();
    }

    public ServiceCategoryResponse getServiceCategoryById(int id) {
        return serviceCategoryMapper.toServiceCategoryResponse(serviceCategoryRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED))) ;
    }

    @Transactional
    public ServiceCategoryResponse updateServiceCategory(int id, ServiceCategoryRequest request) {
        //Check service existed or not
        ServiceCategory serviceCategory = checkServiceCategory(id);
        //Update
        serviceCategoryMapper.updateServiceCategory(serviceCategory, request);

        serviceCategoryRepository.save(serviceCategory);

        return serviceCategoryMapper.toServiceCategoryResponse(serviceCategory);
    }

    public void deleteServiceCategory(int id) {
        /* Check service existed or not */
        ServiceCategory serviceCategory = checkServiceCategory(id);
        serviceCategoryRepository.delete(serviceCategory);
    }

    private ServiceCategory checkServiceCategory(int id) {
        return serviceCategoryRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }
}
