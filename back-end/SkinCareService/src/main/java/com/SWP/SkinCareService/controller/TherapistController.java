package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Therapist.GetScheduleRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Therapist.TherapistResponse;
import com.SWP.SkinCareService.dto.response.Therapist.TherapistSummaryResponse;
import com.SWP.SkinCareService.dto.response.basicDTO.BookingSessionDTO;
import com.SWP.SkinCareService.mapper.TherapistMapper;
import com.SWP.SkinCareService.service.BookingSessionService;
import com.SWP.SkinCareService.service.TherapistService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/therapists")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TherapistController {
    TherapistService therapistService;
    TherapistMapper therapistMapper;
    BookingSessionService bookingSessionService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TherapistResponse> create(
            @Valid @RequestPart("request") TherapistRequest request,
            @RequestPart("img") MultipartFile img) throws IOException {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.create(request, img))
                .build();
    }


    @GetMapping("/getTherapistInfo")
    @PreAuthorize("hasAnyRole('THERAPIST')")
    public ApiResponse<TherapistResponse> getTherapistInfo() {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.getTheraInfo())
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
    @PreAuthorize("hasAnyRole('ADMIN','THERAPIST')")
    public ApiResponse<TherapistResponse> update(
            @PathVariable String id,
            @Valid @RequestPart("request") TherapistUpdateRequest request,
            @RequestPart(value = "img", required = false) MultipartFile img) throws IOException {
        return ApiResponse.<TherapistResponse>builder()
                .result(therapistService.update(id, request, img))
                .build();
    }

    @PutMapping("/{id}/deactivate")
    public ApiResponse<TherapistResponse> deactivateServiceCategory(@PathVariable String id) {
        therapistService.disable(id);
        return ApiResponse.<TherapistResponse>builder()
                .message("Therapist deactivated")
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

    @GetMapping("/by-service/{serviceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'USER')")
    public ApiResponse<Page<TherapistSummaryResponse>> getAllByServiceId(
            @PathVariable int serviceId,
            Pageable pageable) {
        return ApiResponse.<Page<TherapistSummaryResponse>>builder()
                .result(therapistService.getAllByServiceId(serviceId, pageable))
                .build();
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('ADMIN','THERAPIST')")
    ApiResponse<List<TherapistResponse>> getSchedule(@RequestBody GetScheduleRequest request){
        var result = therapistService.getTherapistAvailableInTime(request);
        return ApiResponse.<List<TherapistResponse>>builder().result(result).build();
    }

    @GetMapping("/sessionCompleted")
    @PreAuthorize("hasAnyRole('THERAPIST')")
    ApiResponse<Page<BookingSessionDTO>> getSessionCompleted(@RequestParam (required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                                             @RequestParam (required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
                                                             @PageableDefault(size = 10) Pageable pageable) {
        var result = bookingSessionService.getAllSessionFinishByTherapistBetween(pageable, from, to);
        return ApiResponse.<Page<BookingSessionDTO>>builder().result(result).build();
    }
}
