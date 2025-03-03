package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.BookingSessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.BookingSessionResponse;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.service.BookingSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    ResponseEntity<ApiResponse<BookingSessionResponse>> updateBookingSession(@PathVariable int sessionId, @RequestBody BookingSessionUpdateRequest bookingSessionRequest) {
        var result = bookingSessionService.updateBookingSession(sessionId, bookingSessionRequest);
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
