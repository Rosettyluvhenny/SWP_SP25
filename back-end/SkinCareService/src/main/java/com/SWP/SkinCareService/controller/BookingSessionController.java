package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionUpdateRequest;
import com.SWP.SkinCareService.dto.request.Booking.SessionStatusRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.dto.response.BookingSession.TherapistAvailabilityResponse;
import com.SWP.SkinCareService.dto.response.BookingSession.TimeSlotAvailabilityResponse;
import com.SWP.SkinCareService.service.BookingSessionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

//    @GetMapping()
//    ResponseEntity<ApiResponse<Page<BookingSessionResponse>>> getAllBookingSessions(Pageable pageable) {
//        var result = bookingSessionService.getAllBookingSessions(pageable);
//        return ResponseEntity.status(HttpStatus.OK).body(
//                ApiResponse.<Page<BookingSessionResponse>>builder().result(result).build()
//        );
//    }
    @GetMapping("/mySession")
    ResponseEntity<ApiResponse<Page<BookingSessionResponse>>> getAllByUser(@RequestParam(required = false) String status, Pageable pageable) {
        var result = bookingSessionService.getByUser(status, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<Page<BookingSessionResponse>>builder().result(result).build()
        );
    }
    @GetMapping("/{sessionId}")
    ResponseEntity<ApiResponse<BookingSessionResponse>> getBookingSession(@PathVariable int sessionId) {
        var result = bookingSessionService.getBookingSessionById(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{sessionId}")
    @PreAuthorize("hasAnyRole('STAFF','THERAPIST')")
    ResponseEntity<ApiResponse<BookingSessionResponse>> updateBookingSession(@PathVariable int sessionId,
                                                                             @RequestPart(value = "data",required = false) BookingSessionUpdateRequest bookingSessionRequest,
                                                                             @RequestPart(value = "imgBefore",required = false)MultipartFile imgBefore,
                                                                             @RequestPart(value = "imgAfter",required = false) MultipartFile imgAfter) throws IOException {
        var result = bookingSessionService.updateBookingSession(sessionId, bookingSessionRequest, imgBefore, imgAfter);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{sessionId}")
    @PreAuthorize("hasRole('ADMIN')")
   // @PreAuthorize("@sessionSecurityService.canAccessSession(#id, authentication.principal.id, authentication.authorities.iterator().next().authority)")
    ResponseEntity<ApiResponse<BookingSessionResponse>> deleteBookingSession(@PathVariable int sessionId) {
        bookingSessionService.deleteBookingSession(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().message("Booking session deleted").build()
        );
    }

    @PutMapping("/{sessionId}/status")
    ResponseEntity<ApiResponse<BookingResponse>> updateStatus(@PathVariable int sessionId, @RequestBody SessionStatusRequest rq) {
        bookingSessionService.updateStatus(sessionId, rq);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Update successfull").build()
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

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<BookingSessionResponse>>> getSessionByBooking(@PathVariable int bookingId) {
        var result = bookingSessionService.getSessionByBooking(bookingId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<BookingSessionResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<ApiResponse<List<BookingSessionResponse>>> getSessionByPhoneNumber(@PathVariable String phoneNumber) {
        var result = bookingSessionService.getSessionByPhone(phoneNumber);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<BookingSessionResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/service/{serviceId}/available-slots")
    public ApiResponse<List<TherapistAvailabilityResponse>> getAvailableTimeSlotsWithAvailableTherapists(
            @PathVariable int serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.<List<TherapistAvailabilityResponse>>builder()
                .result(bookingSessionService.getAvailableTimeSlotsWithAvailableTherapists(serviceId, date))
                .build();
    }

    @PutMapping("/{sessionId}/cancel")
    @PreAuthorize("hasAnyRole('USER')")
    ResponseEntity<ApiResponse<BookingResponse>> cancel(@PathVariable int sessionId) {
        bookingSessionService.cancelByUser(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Update successfull").build()
        );
    }
    @GetMapping("/therapist")
    @PreAuthorize("hasRole('THERAPIST')")
    public ApiResponse<List<BookingSessionResponse>> getByTherapist(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ApiResponse.<List<BookingSessionResponse>>builder()
                .result(bookingSessionService.getTherapistSchedule(startDate,endDate))
                .build();
    }
    @GetMapping()
    ResponseEntity<ApiResponse<Page<BookingSessionResponse>>> getAllBookingSessions(@RequestParam(required = false) String status,
                                                                                    @RequestParam(required = false) LocalDate startDate,
                                                                                    @RequestParam(required = false) LocalDate endDate,
                                                                                    Pageable pageable) {
        var result = bookingSessionService.getAll(status, startDate, endDate,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<Page<BookingSessionResponse>>builder().result(result).build()
        );
    }
}
