package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.SessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.service.BookingSessionService;
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

    @GetMapping("/{sessionId}")
    ResponseEntity<ApiResponse<BookingSessionResponse>> getBookingSession(@PathVariable int sessionId) {
        var result = bookingSessionService.getBookingSessionById(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    @GetMapping("/assign")
    ResponseEntity<ApiResponse<List<BookingSessionResponse>>> getAllBookingSessionNullTherapist() {
        var result = bookingSessionService.getAllBookingNullTherapist();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<BookingSessionResponse>>builder().result(result).build()
        );
    }
    //Update before Session start, update room and img
    @PutMapping(value = "/before/{sessionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ApiResponse<BookingSessionResponse>> updateBeforeBookingSession(
            @PathVariable int sessionId,
            @RequestPart("data") SessionUpdateRequest bookingSessionRequest,
            @RequestParam("img") MultipartFile img) throws IOException {

        if (img == null || img.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<BookingSessionResponse>builder()
                            .code(400)
                            .message("Image file is required")
                            .build()
            );
        }


        var result = bookingSessionService.updateBefore(sessionId, bookingSessionRequest, img);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    //Update after session finish
    @PutMapping(value = "/after/{sessionId}")
    ResponseEntity<ApiResponse<BookingSessionResponse>> updateAfterBookingSession(
            @PathVariable int sessionId,
            @RequestParam("img") MultipartFile img) throws IOException {

        if (img == null || img.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<BookingSessionResponse>builder()
                            .code(400)
                            .message("Image file is required")
                            .build()
            );
        }

        var result = bookingSessionService.updateAfter(sessionId, img);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    @PutMapping("/therapist/{sessionId}")
    ResponseEntity<ApiResponse<BookingSessionResponse>> updateTherapist(@PathVariable int sessionId, @RequestBody SessionUpdateRequest request) {
        var result = bookingSessionService.assignTherapistToSession(sessionId, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{sessionId}")
    ResponseEntity<ApiResponse<BookingSessionResponse>> deleteBookingSession(@PathVariable int sessionId) {
        bookingSessionService.deleteBookingSession(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().message("Booking session deleted").build()
        );
    }
}
