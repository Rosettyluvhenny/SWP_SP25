package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Services.ServicesRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Services.ServicesResponse;
import com.SWP.SkinCareService.service.ServicesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServicesController {
    ServicesService servicesService;

    @Operation(summary = "Create a new service", description = "Create a new service with image upload")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ServicesResponse>> createServiceCategory(
            @Parameter(description = "Name of the service")
            @RequestParam @NotBlank(message = "NOT_EMPTY") String name,
            
            @Parameter(description = "Service category ID")
            @RequestParam @NotNull(message = "NOT_EMPTY") @Min(value = 1, message = "MIN") Integer serviceCategoryId,
            
            @Parameter(description = "Description of the service")
            @RequestParam @NotBlank(message = "NOT_EMPTY") String description,
            
            @Parameter(description = "Price of the service in dollars")
            @RequestParam @NotNull(message = "NOT_EMPTY") @Min(value = 0, message = "MIN") BigDecimal price,
            
            @Parameter(description = "Duration of the service in minutes")
            @RequestParam @NotNull(message = "NOT_EMPTY") @Min(value = 1, message = "MIN") Integer duration,
            
            @Parameter(description = "Number of sessions")
            @RequestParam @NotNull(message = "NOT_EMPTY") @Min(value = 1, message = "MIN") Integer session,
            
            @Parameter(description = "Whether the service is active")
            @RequestParam(defaultValue = "true") Boolean active,
            
            @Parameter(description = "Service image file")
            @RequestParam MultipartFile img) throws IOException {
        
        if (img == null || img.isEmpty()) {
            return ResponseEntity.badRequest().body(
                ApiResponse.<ServicesResponse>builder()
                    .code(400)
                    .message("Image file is required")
                    .build()
            );
        }

        ServicesRequest request = ServicesRequest.builder()
                .name(name)
                .serviceCategoryId(serviceCategoryId)
                .description(description)
                .price(price)
                .duration(duration)
                .session(session)
                .active(active)
                .build();

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

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServicesResponse>>> getAll() throws IOException {
        var result = servicesService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<ServicesResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @Operation(summary = "Update a service", description = "Update an existing service with image upload")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ServicesResponse>> updateServiceCategory(
            @PathVariable int id,
            @Parameter(description = "Name of the service")
            @RequestParam(required = false) String name,
            
            @Parameter(description = "Service category ID")
            @RequestParam(required = false) Integer serviceCategoryId,
            
            @Parameter(description = "Description of the service")
            @RequestParam(required = false) String description,
            
            @Parameter(description = "Price of the service in dollars")
            @RequestParam(required = false) BigDecimal price,
            
            @Parameter(description = "Duration of the service in minutes")
            @RequestParam(required = false) Integer duration,
            
            @Parameter(description = "Number of sessions")
            @RequestParam(required = false) Integer session,
            
            @Parameter(description = "Whether the service is active")
            @RequestParam(required = false) Boolean active,
            
            @Parameter(description = "Service image file")
            @RequestParam MultipartFile img) throws IOException {
        
        if (img == null || img.isEmpty()) {
            return ResponseEntity.badRequest().body(
                ApiResponse.<ServicesResponse>builder()
                    .code(400)
                    .message("Image file is required")
                    .build()
            );
        }

        ServicesUpdateRequest request = ServicesUpdateRequest.builder()
                .name(name)
                .serviceCategoryId(serviceCategoryId)
                .description(description)
                .price(price)
                .duration(duration)
                .session(session)
                .active(active)
                .build();

        var result = servicesService.update(id, request, img);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServicesResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse> activateServiceCategory(@PathVariable int id){
        servicesService.activate(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Service activated successfully")
                        .build()
        );
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivateServiceCategory(@PathVariable int id){
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
