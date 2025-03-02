package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.PaymentRequest;
import com.SWP.SkinCareService.dto.response.PaymentResponse;
import com.SWP.SkinCareService.entity.Payment;
import com.SWP.SkinCareService.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    public boolean existsByPaymentName(String paymentName) {
        return paymentRepository.existsByPaymentName(paymentName);
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public PaymentResponse getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .map(this::convertToResponse)
                .orElse(null);
    }

    public PaymentResponse createPayment(PaymentRequest request) {
        if (paymentRepository.existsByPaymentName(request.getPaymentName())) {
            throw new IllegalArgumentException("Phương thức thanh toán đã tồn tại!");
        }
        Payment payment = convertToEntity(request);
        return convertToResponse(paymentRepository.save(payment));
    }

    public PaymentResponse updatePaymentById(Long id, PaymentRequest request) {
        Optional<Payment> existingPayment = paymentRepository.findById(id);
        if (existingPayment.isPresent()) {
            Payment payment = existingPayment.get();
            payment.setPaymentName(request.getPaymentName());
            return convertToResponse(paymentRepository.save(payment));
        }
        return null;
    }

    public boolean deletePaymentById(Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private PaymentResponse convertToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .paymentName(payment.getPaymentName())
                .build();
    }

    private Payment convertToEntity(PaymentRequest request) {
        return Payment.builder()
                .paymentName(request.getPaymentName())
                .build();
    }
}
