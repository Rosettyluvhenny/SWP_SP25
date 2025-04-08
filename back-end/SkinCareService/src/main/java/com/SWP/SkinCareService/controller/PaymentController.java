package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Payment.PaymentRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Payment.PaymentResponse;
import com.SWP.SkinCareService.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PaymentController {
    PaymentService paymentService;

    @Operation(
        summary = "Create a new payment method",
        description = "Create a new payment method with name"
    )
    @PostMapping
    ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@RequestBody @Valid PaymentRequest request) {
        var result = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<PaymentResponse>builder().result(result).build()
        );
    }

    @Operation(
        summary = "Get all payment methods",
        description = "Retrieve all available payment methods"
    )
    @GetMapping
    ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        var result = paymentService.getAllPayments();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<PaymentResponse>>builder().result(result).build()
        );
    }

    @Operation(
        summary = "Get payment method by ID",
        description = "Retrieve a specific payment method by its ID"
    )
    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Integer id) {
        var result = paymentService.getPaymentById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<PaymentResponse>builder().result(result).build()
        );
    }

    @Operation(
        summary = "Update payment method",
        description = "Update an existing payment method by its ID"
    )
    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<PaymentResponse>> updatePayment(
            @PathVariable Integer id,
            @RequestBody @Valid PaymentRequest request) {
        var result = paymentService.updatePayment(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<PaymentResponse>builder().result(result).build()
        );
    }

    @Operation(
        summary = "Delete payment method",
        description = "Delete an existing payment method by its ID"
    )
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Payment deleted successfully").build()
        );
    }

    @PutMapping("/active/{id}")
    ResponseEntity<ApiResponse> activatePayment(@PathVariable Integer id) {
        paymentService.activePayment(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Payment activated successfully").build()
        );
    }

    @PutMapping("/deactive/{id}")
    ResponseEntity<ApiResponse> deactivatePayment(@PathVariable Integer id) {
        paymentService.inactivePayment(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Payment deactivated successfully").build()
        );
    }
} 