package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionUpdateRequest;
import com.SWP.SkinCareService.dto.request.Booking.StatusRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.service.BookingSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/bookingSession")
public class BookingSessionController {
    @Autowired
    private BookingSessionService bookingSessionService;

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

    @PutMapping("/{sessionId}")
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
    ResponseEntity<ApiResponse<BookingSessionResponse>> deleteBookingSession(@PathVariable int sessionId) {
        bookingSessionService.deleteBookingSession(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingSessionResponse>builder().message("Booking session deleted").build()
        );
    }

    @PutMapping("/{sessionId}/status")
    ResponseEntity<ApiResponse<BookingResponse>> deleteBooking(@PathVariable int sessionId, @RequestBody StatusRequest status) {
        bookingSessionService.updateStatus(sessionId, status);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Updates successfull").build()
        );
    }
}
