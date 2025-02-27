package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Services.ServiceInfoRequest;
import com.SWP.SkinCareService.dto.request.Services.ServiceInfoUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Services.ServiceInfoResponse;
import com.SWP.SkinCareService.service.ServiceInfoService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/serviceInfo")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ServiceInfoController {
    ServiceInfoService serviceInfoService;

    @PostMapping
    ResponseEntity<ApiResponse<ServiceInfoResponse>> createServiceInfo(@ModelAttribute @Valid ServiceInfoRequest request,
                                                                       @RequestParam(value = "serviceImg", required = false) MultipartFile serviceImg,
                                                                       @RequestParam(value = "desImg", required = false) MultipartFile desImg,
                                                                       @RequestParam(value = "techImg", required = false) MultipartFile techImg,
                                                                       @RequestParam(value = "mechaImg", required = false) MultipartFile mechaImg) throws IOException {
        var result = serviceInfoService.createServiceInfo(request, serviceImg, desImg, techImg, mechaImg);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<ServiceInfoResponse>builder()
                        .result(result)
                        .build()
        );
    }
    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<ServiceInfoResponse>> getServiceInfo(@PathVariable int id) throws IOException {
        var result = serviceInfoService.getServiceInfo(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ServiceInfoResponse>builder()
                        .result(result)
                        .build()
        );
    }
    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<ServiceInfoResponse>> updateServiceInfo(@PathVariable int id, @ModelAttribute ServiceInfoUpdateRequest request,
                                                                       @RequestParam(value = "serviceImg", required = false) MultipartFile serviceImg,
                                                                       @RequestParam(value = "desImg", required = false) MultipartFile desImg,
                                                                       @RequestParam(value = "techImg", required = false) MultipartFile techImg,
                                                                       @RequestParam(value = "mechaImg", required = false) MultipartFile mechaImg) throws IOException {
        var result = serviceInfoService.updateServiceInfo(id, request, serviceImg, desImg, techImg, mechaImg);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<ServiceInfoResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteServiceCategory(@PathVariable int id) throws IOException {
        serviceInfoService.deleteServiceInfo(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder()
                        .message("Service delete successfully")
                        .build()
        );
    }
}
