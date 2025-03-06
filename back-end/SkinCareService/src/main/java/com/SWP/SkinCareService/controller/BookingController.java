package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

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
    public ResponseEntity<ApiResponse<BookingResponse>> create(@Valid @RequestBody BookingRequest request) throws IOException {
        var result = bookingService.create(request);
        return ResponseEntity.ok(
                ApiResponse.<BookingResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @Operation(summary = "Get a booking by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF')")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(@PathVariable int id) {
        var result = bookingService.getById(id);
        return ResponseEntity.ok(
                ApiResponse.<BookingResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @Operation(summary = "Get all bookings for authenticated user")
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getAllByUser(Pageable pageable) throws IOException {
        var result = bookingService.getAllByUser(pageable);
        return ResponseEntity.ok(
                ApiResponse.<Page<BookingResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @Operation(summary = "Get all bookings for authenticated staff")
    @GetMapping("/staff-bookings")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getAllByStaff(Pageable pageable) {
        var result = bookingService.getAllByStaff(pageable);
        return ResponseEntity.ok(
                ApiResponse.<Page<BookingResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @Operation(summary = "Get all bookings for authenticated staff using user phone number")
    @GetMapping("/staff-bookings/{phone}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getAllByPhone(@PathVariable @Pattern(regexp = "^\\d{10}$",message = "PHONE_NO_INVALID")  String phone ,Pageable pageable) {
        var result = bookingService.getAllByUserPhone(phone,pageable);
        return ResponseEntity.ok(
                ApiResponse.<Page<BookingResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @Operation(summary = "Get all bookings for authenticated staff using user phone number")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<BookingResponse>> UpdateStatus(@PathVariable int id ,@RequestBody String status) {
        var result = bookingService.updateStatus(id,status);
        return ResponseEntity.ok(
                ApiResponse.<BookingResponse>builder()
                        .result(result)
                        .build()
        );
    }
} 