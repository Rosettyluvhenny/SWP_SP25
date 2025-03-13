package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.dto.response.BookingSession.TherapistAvailabilityResponse;
import com.SWP.SkinCareService.dto.response.BookingSession.TimeSlotAvailabilityResponse;
import com.SWP.SkinCareService.service.BookingSessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookingSession")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingSessionController {
    BookingSessionService bookingSessionService;

    @PostMapping()
    ResponseEntity<ApiResponse<BookingSessionResponse>> createBookingSession(@RequestBody BookingSessionRequest bookingSessionRequest) {
        var result = bookingSessionService.createBookingSession(bookingSessionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<BookingSessionResponse>>> getAllBookingSessions() {
        var result = bookingSessionService.getAllBookingSessions();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<BookingSessionResponse>>builder().result(result).build()
        );
    }

    @PreAuthorize("@customSecurityService.canAccessSession(#id, authentication.principal.id, authentication.authorities.iterator().next().authority)")
    @GetMapping("/{sessionId}")
    ResponseEntity<ApiResponse<BookingSessionResponse>> getBookingSession(@PathVariable int sessionId) {
        var result = bookingSessionService.getBookingSessionById(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{sessionId}")
    //@PreAuthorize("hasRole('STAFF','THERAPIST')")
    ResponseEntity<ApiResponse<BookingSessionResponse>> updateBookingSession(@PathVariable int sessionId,
                                                                             @RequestPart("data") BookingSessionUpdateRequest bookingSessionRequest,
                                                                             @RequestPart("imgBefore")MultipartFile imgBefore,
                                                                             @RequestPart("imgAfter") MultipartFile imgAfter) throws IOException {
        var result = bookingSessionService.updateBookingSession(sessionId, bookingSessionRequest, imgBefore, imgAfter);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{sessionId}")
   // @PreAuthorize("@sessionSecurityService.canAccessSession(#id, authentication.principal.id, authentication.authorities.iterator().next().authority)")
    ResponseEntity<ApiResponse<BookingSessionResponse>> deleteBookingSession(@PathVariable int sessionId) {
        bookingSessionService.deleteBookingSession(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().message("Booking session deleted").build()
        );
    }

    @PutMapping("/{sessionId}/status")
    //@PreAuthorize("hasRole('STAFF','THERAPIST')")
    ResponseEntity<ApiResponse<BookingResponse>> updateStatus(@PathVariable int sessionId, @RequestParam String status) {
        bookingSessionService.updateStatus(sessionId, status);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Updates successfull").build()
        );
    }

    @GetMapping("/therapist/{therapistId}/service/{serviceId}/available-slots")
    public ApiResponse<List<TimeSlotAvailabilityResponse>> getAvailableTimeSlotsForTherapist(
            @PathVariable String therapistId,
            @PathVariable int serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.<List<TimeSlotAvailabilityResponse>>builder()
                .result(bookingSessionService.getAvailableTimeSlotsForTherapist(therapistId, serviceId, date))
                .build();
    }

    @GetMapping("/service/{serviceId}/available-slots")
    public ApiResponse<List<TherapistAvailabilityResponse>> getAvailableTimeSlotsWithAvailableTherapists(
            @PathVariable int serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.<List<TherapistAvailabilityResponse>>builder()
                .result(bookingSessionService.getAvailableTimeSlotsWithAvailableTherapists(serviceId, date))
                .build();
    }
}
