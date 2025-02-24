package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.service.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.service.ServiceCategoryResponse;
import com.SWP.SkinCareService.service.ServiceCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/serviceCategory")
public class ServiceCategoryController {
    @Autowired
    private ServiceCategoryService serviceCategoryService;

    @PostMapping()
    ResponseEntity<ApiResponse<ServiceCategoryResponse>> createServiceCategory(@RequestBody ServiceCategoryRequest request) {
        var result = serviceCategoryService.createServiceCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<ServiceCategoryResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<ServiceCategoryResponse>>> getAllServiceCategory() {
        var result = serviceCategoryService.getAllServiceCategory();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<ServiceCategoryResponse>>builder()
                        .result(result)
                        .build()
        );
    }


    @GetMapping("/{serviceCategoryId}")
    ResponseEntity<ApiResponse<ServiceCategoryResponse>> getServiceCategoryById(@PathVariable int serviceCategoryId) {
        var result = serviceCategoryService.getServiceCategoryById(serviceCategoryId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServiceCategoryResponse>builder()
                        .result(result)
                        .build()
        );
    }


    @PutMapping("/{serviceCategoryId}")
    ResponseEntity<ApiResponse<ServiceCategoryResponse>> updateServiceCategory(@PathVariable int serviceCategoryId, @RequestBody ServiceCategoryRequest request) {
        var result = serviceCategoryService.updateServiceCategory(serviceCategoryId, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServiceCategoryResponse>builder()
                        .result(result)
                        .build()
        );
    }


    @DeleteMapping("/{serviceCategoryId}")
    ResponseEntity<ApiResponse> deleteServiceCategory(@PathVariable int serviceCategoryId) {
        serviceCategoryService.deleteServiceCategory(serviceCategoryId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Deleted")
                        .build()
        );
    }
}
