package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final VNPayController vnPayController;


    @PostMapping()
    ResponseEntity<ApiResponse<BookingResponse>> createBooking(@RequestBody BookingRequest bookingRequest, HttpServletRequest request) {
        String ipAddress = vnPayController.getIpAddress(request);
        if (!StringUtils.hasText(ipAddress)) {
            throw new AppException(ErrorCode.VNPAY_INVALID_IP_ADDRESS);
        }
        var result = bookingService.createBooking(bookingRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<BookingResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/payment/{bookingId}")
    ResponseEntity<ApiResponse<BookingResponse>> requestPayment(@PathVariable int bookingId, HttpServletRequest request) {
        String ipAddress = vnPayController.getIpAddress(request);
        if (!StringUtils.hasText(ipAddress)) {
            throw new AppException(ErrorCode.VNPAY_INVALID_IP_ADDRESS);
        }
        var result = bookingService.requestPayment(bookingId, ipAddress);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        var result = bookingService.getAllBookings();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<BookingResponse>>builder().result(result).build()
        );
    }

    @PutMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('STAFF','THERAPIST')")
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
    @PreAuthorize("hasRole('STAFF')")
    ResponseEntity<ApiResponse<BookingResponse>> updateStatus(@PathVariable int bookingId, @RequestParam String status) {
        bookingService.updateStatus(bookingId, status);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Updates successfull").build()
        );
    }

    @PutMapping("/{bookingId}/paymentStatus")
    @PreAuthorize("hasRole('STAFF')")
    ResponseEntity<ApiResponse<BookingResponse>> updatePaymentStatus(@PathVariable int bookingId, @RequestParam String status) {
        bookingService.updatePaymentStatus(bookingId, status);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Updates payment status successfull").build()
        );
    }

    @Operation(summary = "Get a booking by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'STAFF','ADMIN')")
    public ResponseEntity<BookingResponse> getById(@PathVariable int id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }

    @Operation(summary = "Get all bookings for authenticated user")
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<BookingResponse>> getAllByUser(@RequestParam(required = false) String status,
                                                              @RequestParam(required = false) String payStatus,
                                                              @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        var result = bookingService.getAllByUser(status ,payStatus, pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get all bookings for authenticated staff")
    @GetMapping("/staff-bookings")
    public ResponseEntity<Page<BookingResponse>> getAllByStaff(@RequestParam(required = false) @Pattern(regexp = "^\\d{10}$", message = "PHONE_INVALID") String phone,
                                                               @RequestParam(required =false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                               @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                               @RequestParam(required = false) String status,
                                                               Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllByStaff(phone,startDate, endDate, status , pageable));
    }

    @PutMapping("/cancel/{bookingId}")
    ResponseEntity<ApiResponse<BookingResponse>> cancelByUser(@PathVariable int bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BookingResponse>builder().message("Updates status successfull").build()
        );
    }
}
