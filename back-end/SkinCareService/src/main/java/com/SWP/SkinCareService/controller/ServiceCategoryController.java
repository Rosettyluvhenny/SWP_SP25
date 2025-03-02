package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Services.ServiceCategoryRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Services.ServiceCategoryResponse;
import com.SWP.SkinCareService.service.ServiceCategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceCategoryController {
    ServiceCategoryService serviceCategoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceCategoryResponse>> createServiceCategory(@RequestBody @Valid ServiceCategoryRequest request){
        var result = serviceCategoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<ServiceCategoryResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceCategoryResponse>> getServiceCategoryById(@PathVariable int id){
        var result = serviceCategoryService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServiceCategoryResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<ServiceCategoryResponse>>> getAllServiceCategory() {
        var result = serviceCategoryService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<ServiceCategoryResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceCategoryResponse>> updateServiceCategory(@PathVariable int id, @RequestBody @Valid ServiceCategoryRequest request){
        var result = serviceCategoryService.update(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServiceCategoryResponse>builder()
                        .result(result)
                        .build()
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteServiceCategory(@PathVariable int id){
        serviceCategoryService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Service Category delete successfully")
                        .build()
        );
    }
}
