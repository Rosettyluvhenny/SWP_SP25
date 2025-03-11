package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;


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

    @PutMapping("/{bookingId}/status")
    ResponseEntity<ApiResponse<BookingResponse>> updateStatus(@PathVariable int bookingId, @RequestParam String status) {
        bookingService.updateStatus(bookingId, status);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Updates successfull").build()
        );
    }

}
/*
package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Booking Management", description = "APIs for managing bookings")
@SecurityRequirement(name = "Bearer Authentication")
public class BookingController {
    BookingService bookingService;

    @Operation(summary = "Create a new booking")
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.create(request));
    }

    @Operation(summary = "Get a booking by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'STAFF')")
    public ResponseEntity<BookingResponse> getById(@PathVariable int id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }

    @Operation(summary = "Get all bookings for authenticated user")
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<BookingResponse>> getAllByUser(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllByUser(pageable));
    }

    @Operation(summary = "Get all bookings for authenticated staff")
    @GetMapping("/staff-bookings")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Page<BookingResponse>> getAllByStaff(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllByStaff(pageable));
    }
}
 */
