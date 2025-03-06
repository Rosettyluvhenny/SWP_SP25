package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.TherapistResponse;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.mapper.TherapistMapper;
import com.SWP.SkinCareService.service.TherapistService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.RequestEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/therapists")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TherapistController {
    TherapistService therapistService;
    TherapistMapper therapistMapper;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TherapistResponse> create(@RequestPart("data") TherapistRequest request, @RequestPart("img") MultipartFile file) throws IOException {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.create(request,file))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<TherapistResponse>> getAll() {
        return ApiResponse.<List<TherapistResponse>>builder()
                .result(therapistService.findAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<TherapistResponse> getById(@PathVariable String id) {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.findById(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @PostAuthorize("returnObject.id == authentication.id")
    public ApiResponse<TherapistResponse> update(@PathVariable String id,
                                                 @RequestPart("data") TherapistUpdateRequest request,
                                                 @RequestPart("img") MultipartFile file) {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.update(id, request,file))
                .build();
    }

    @DeleteMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> disable(@PathVariable String id) {
        therapistService.disable(id);
        return ApiResponse.<Void>builder()
                .message("Therapist disabled successfully")
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable String id) {
        therapistService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Therapist deleted successfully")
                .build();
    }

    // New endpoints for managing therapist services
    @PostMapping("/{therapistId}/services/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TherapistResponse> addService(
            @PathVariable String therapistId,
            @PathVariable int serviceId) {
        Therapist therapist = therapistService.addService(therapistId, serviceId);
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistMapper.toTherapistResponse(therapist))
                .message("Service added to therapist successfully")
                .build();
    }

    @DeleteMapping("/{therapistId}/services/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TherapistResponse> removeService(
            @PathVariable String therapistId,
            @PathVariable int serviceId) {
        Therapist therapist = therapistService.removeService(therapistId, serviceId);
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistMapper.toTherapistResponse(therapist))
                .message("Service removed from therapist successfully")
                .build();
    }

    @GetMapping("/by-service/{serviceId}")
    public ApiResponse<Page<TherapistResponse>> getTherapistsByService(
            @PathVariable int serviceId,
            Pageable pageable) {
        Page<TherapistResponse> therapists = therapistService.findTherapistsByService(serviceId, pageable)
                .map(therapistMapper::toTherapistResponse);
        return ApiResponse.<Page<TherapistResponse>>builder()
                .result(therapists)
                .build();
    }
}
