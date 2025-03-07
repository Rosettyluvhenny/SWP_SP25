package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.BookingRequest;
import com.SWP.SkinCareService.dto.request.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.BookingResponse;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;


    @PostMapping()
    ResponseEntity<ApiResponse<BookingResponse>> createBooking(@RequestBody BookingRequest bookingRequest) {
        var result = bookingService.createBooking(bookingRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<BookingResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        var result = bookingService.getAllBookings();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<BookingResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{bookingId}")
    ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable int bookingId) {
        var result = bookingService.getBookingById(bookingId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{bookingId}")
    ResponseEntity<ApiResponse<BookingResponse>> updateBooking(@PathVariable int bookingId, @RequestBody BookingUpdateRequest bookingRequest) {
        var result = bookingService.updateBooking(bookingId, bookingRequest);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().result(result).build()
        );
    }

    @DeleteMapping("/{bookingId}")
    ResponseEntity<ApiResponse<BookingResponse>> deleteBooking(@PathVariable int bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Booking deleted").build()
        );
    }

}
