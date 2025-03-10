package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Therapist.GetScheduleRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Therapist.TherapistResponse;
import com.SWP.SkinCareService.dto.response.Therapist.TherapistSummaryResponse;
import com.SWP.SkinCareService.mapper.TherapistMapper;
import com.SWP.SkinCareService.service.TherapistService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TherapistResponse> create(
            @Valid @RequestPart("request") TherapistRequest request,
            @RequestPart("img") MultipartFile img) throws IOException {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.create(request, img))
                .build();
    }

    @GetMapping
    //@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<TherapistResponse>> getAll(
            @RequestParam(defaultValue = "true") boolean isActive,
            Pageable pageable) {
        return ApiResponse.<Page<TherapistResponse>>builder()
                .result(therapistService.findAll(isActive, pageable))
                .build();
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<TherapistResponse> getById(@PathVariable String id) {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.findById(id))
                .build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TherapistResponse> update(
            @PathVariable String id,
            @Valid @RequestPart("request") TherapistUpdateRequest request,
            @RequestPart(value = "img", required = false) MultipartFile img) throws IOException {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.update(id, request, img))
                .build();
    }

    @DeleteMapping("/{id}/disable")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> disable(@PathVariable String id) {
        therapistService.disable(id);
        return ApiResponse.<Void>builder()
                .message("Therapist disabled successfully")
                .build();
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable String id) {
        therapistService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Therapist deleted successfully")
                .build();
    }

    @GetMapping("/by-service/{serviceId}")
    //@PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'USER')")
    public ApiResponse<Page<TherapistSummaryResponse>> getAllByServiceId(
            @PathVariable int serviceId,
            Pageable pageable) {
        return ApiResponse.<Page<TherapistSummaryResponse>>builder()
                .result(therapistService.getAllByServiceId(serviceId, pageable))
                .build();
    }

    @PostMapping("/schedule")
    ApiResponse<List<TherapistResponse>> getSchedule(@RequestBody GetScheduleRequest request){
        var result = therapistService.getTherapistAvailableInTime(request);
        return ApiResponse.<List<TherapistResponse>>builder().result(result).build();
    }
}
