package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.service.ServiceCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/serviceCategory")
public class ServiceCategoryController {
    @Autowired
    private ServiceCategoryService serviceCategoryService;

    @PostMapping()
    public ResponseEntity<ApiResponse> createServiceCategory(@RequestBody ServiceCategoryRequest request) {
        return serviceCategoryService.createServiceCategory(request);
    }

    @GetMapping()
    public List<ServiceCategory> getAllServiceCategory() {
        return serviceCategoryService.getAllServiceCategory();
    }

    @GetMapping("/{serviceCategoryId}")
    public ServiceCategory getServiceCategoryById(@PathVariable int serviceCategoryId) {
        return serviceCategoryService.getServiceCategoryById(serviceCategoryId);
    }

    @PutMapping("/{serviceCategoryId}")
    public ResponseEntity<ApiResponse> updateServiceCategory(@PathVariable int serviceCategoryId, @RequestBody ServiceCategoryRequest request) {
        return serviceCategoryService.updateServiceCategory(serviceCategoryId, request);
    }

    @DeleteMapping("/{serviceCategoryId}")
    public ResponseEntity<ApiResponse> deleteServiceCategory(@PathVariable int serviceCategoryId) {
        return serviceCategoryService.deleteServiceCategory(serviceCategoryId);
    }
}
