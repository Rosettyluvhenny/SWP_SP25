package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.ServiceRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.ServiceResponse;
import com.SWP.SkinCareService.service.ServiceListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Validated
@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceListApi {
    private final ServiceListService serviceListService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getAllServices() {
        List<ServiceResponse> services = serviceListService.getAllServices();
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", services));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> getServiceById(@PathVariable Long id) {
        ServiceResponse service = serviceListService.getServiceById(id);
        if (service != null) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Success", service));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Service not found", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceResponse>> createService(@Valid @RequestBody ServiceRequest request) {
        ServiceResponse createdService = serviceListService.createService(request);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Service created successfully", createdService));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(@PathVariable Long id, @RequestBody ServiceRequest request) {
        ServiceResponse updatedService = serviceListService.updateServiceById(id, request);
        if (updatedService != null) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Service updated successfully", updatedService));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Service not found", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        boolean deleted = serviceListService.deleteServiceById(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Service deleted successfully", null));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Service not found", null));
    }
}