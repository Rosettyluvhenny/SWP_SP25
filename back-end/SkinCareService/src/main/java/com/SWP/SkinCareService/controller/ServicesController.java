package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Services.ServicesRequest;
import com.SWP.SkinCareService.dto.request.Services.ServicesUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Services.ServicesResponse;
import com.SWP.SkinCareService.service.ServicesService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServicesController {
    ServicesService servicesService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ServicesResponse>> createServiceCategory(@ModelAttribute @Valid ServicesRequest request, 
            @RequestParam(required = false) MultipartFile img) throws IOException {
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
    public ResponseEntity<ApiResponse<ServicesResponse>> getById(@PathVariable int id){
        var result = servicesService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServicesResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServicesResponse>>> getAll(){
        var result = servicesService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<ServicesResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ServicesResponse>> updateServiceCategory(@PathVariable int id, 
            @ModelAttribute @Valid ServicesUpdateRequest request, 
            @RequestParam(required = false) MultipartFile img) throws IOException {
        if (img == null || img.isEmpty()) {
            return ResponseEntity.badRequest().body(
                ApiResponse.<ServicesResponse>builder()
                    .code(400)
                    .message("Image file is required")
                    .build()
            );
        }
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
