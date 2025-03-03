package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.PaymentRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.PaymentResponse;
import com.SWP.SkinCareService.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping()
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody PaymentRequest request) {
        var result = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<PaymentResponse>builder().result(result).build()
        );
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        var result = paymentService.getAllPayments();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<PaymentResponse>>builder().result(result).build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        var result = paymentService.getPaymentById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<PaymentResponse>builder().result(result).build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> updatePayment(@PathVariable Long id, @RequestBody PaymentRequest request) {
        var result = paymentService.updatePaymentById(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<PaymentResponse>builder().result(result).build()
        );
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
