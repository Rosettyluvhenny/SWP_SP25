package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.PaymentRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.PaymentResponse;
import com.SWP.SkinCareService.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentApi {
    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", payments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        PaymentResponse payment = paymentService.getPaymentById(id);
        if (payment != null) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Success", payment));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Payment not found", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody PaymentRequest request) {
        if (paymentService.existsByPaymentName(request.getPaymentName())) {
            return ResponseEntity.status(400).body(new ApiResponse<>(400, "Payment name already exists", null));
        }
        PaymentResponse createdPayment = paymentService.createPayment(request);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Payment created successfully", createdPayment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> updatePayment(@PathVariable Long id, @RequestBody PaymentRequest request) {
        PaymentResponse updatedPayment = paymentService.updatePaymentById(id, request);
        if (updatedPayment != null) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Payment updated successfully", updatedPayment));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Payment not found", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePayment(@PathVariable Long id) {
        boolean deleted = paymentService.deletePaymentById(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Payment deleted successfully", null));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(404, "Payment not found", null));
    }
}
