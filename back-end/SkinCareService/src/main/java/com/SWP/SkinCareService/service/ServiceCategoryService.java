package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.repository.ServiceCategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceCategoryService {
    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    public ResponseEntity<ApiResponse> createServiceCategory(ServiceCategoryRequest request) {
        ServiceCategory serviceCategory = new ServiceCategory();
        serviceCategory.setCategoryName(request.getCategoryName());
        serviceCategory.setDescription(request.getDescription());
        serviceCategoryRepository.save(serviceCategory);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.CREATED.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Service Category Created");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    public List<ServiceCategory> getAllServiceCategory() {
        return serviceCategoryRepository.findAll();
    }

    public ServiceCategory getServiceCategoryById(int id) {
        return serviceCategoryRepository.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }

    @Transactional
    public ResponseEntity<ApiResponse> updateServiceCategory(int id, ServiceCategoryRequest request) {
        //Check service existed or not
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        //Update
        serviceCategory.setCategoryName(request.getCategoryName());
        serviceCategory.setDescription(request.getDescription());
        serviceCategoryRepository.save(serviceCategory);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Service Category Updated");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    public ResponseEntity<ApiResponse> deleteServiceCategory(int id) {
        //Check service existed or not
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(Integer.toString(id)).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        //Delete
        serviceCategoryRepository.delete(serviceCategory);
        //Response to client
        ApiResponse apiResponse = new ApiResponse();
        int status = HttpStatus.OK.value();
        apiResponse.setCode(status);
        apiResponse.setMessage("Service Category Deleted");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
