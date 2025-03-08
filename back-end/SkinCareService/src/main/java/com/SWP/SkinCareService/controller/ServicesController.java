package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Services.ServicesRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesUpdateRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Services.ServicesResponse;
import com.SWP.SkinCareService.service.ServicesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServicesController {
    ServicesService servicesService;

    @Operation(summary = "Create a new service", description = "Create a new service with image upload")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ServicesResponse>> createServiceCategory(
            @RequestPart("data")ServicesRequest request,
            @Parameter(description = "Service image file")
            @RequestPart(value = "img") MultipartFile img) throws IOException {
        
        if (img == null || img.isEmpty()) {
            return ResponseEntity.badRequest().body(
                ApiResponse.<ServicesResponse>builder()
                    .code(400)
                    .message("Image file is required")
                    .build()
            );
        }


        var result = servicesService.create(request, img);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<ServicesResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServicesResponse>> getById(@PathVariable int id) throws IOException {
        var result = servicesService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServicesResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @Operation(
        summary = "Get all active services",
        description = "Retrieve a paginated list of all active services. Use page, size, and sort parameters for pagination and sorting."
    )
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ServicesResponse>>> getAll(@RequestParam(defaultValue = "false") boolean isActive,
            @Parameter(description = "Page number (0-based)")
            @PageableDefault(size = 10, sort = "id") Pageable pageable) throws IOException {
        var result = servicesService.getAll(isActive,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<Page<ServicesResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @Operation(summary = "Update a service", description = "Update an existing service with image upload")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ServicesResponse>> updateServiceCategory(@PathVariable int id,
            @RequestPart("data")ServicesUpdateRequest request,
            @Parameter(description = "Service image file")
            @RequestPart(value = "img",required = false) MultipartFile img) throws IOException {

        var result = servicesService.update(id, request, img);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServicesResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse> activateServiceCategory(@PathVariable int id) {
        servicesService.activate(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Service activated successfully")
                        .build()
        );
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivateServiceCategory(@PathVariable int id) {
        servicesService.deactivate(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Service deactivated successfully")
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteServiceCategory(@PathVariable int id) throws IOException {
        servicesService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Service deleted successfully")
                        .build()
        );
    }
}
