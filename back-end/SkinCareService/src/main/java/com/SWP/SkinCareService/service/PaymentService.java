package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Payment.PaymentRequest;
import com.SWP.SkinCareService.dto.response.Payment.PaymentResponse;
import com.SWP.SkinCareService.entity.Payment;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.PaymentMapper;
import com.SWP.SkinCareService.repository.PaymentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PaymentService {
    PaymentRepository paymentRepository;
    PaymentMapper paymentMapper;

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Payment payment = paymentMapper.toPayment(request);
        paymentRepository.save(payment);
        return paymentMapper.toPaymentResponse(payment);
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toPaymentResponse)
                .toList();
    }

    public PaymentResponse getPaymentById(Integer id) {
        return paymentMapper.toPaymentResponse(checkPayment(id));
    }

    @Transactional
    public PaymentResponse updatePayment(Integer id, PaymentRequest request) {
        Payment payment = checkPayment(id);
        paymentMapper.updatePayment(payment, request);
        paymentRepository.save(payment);
        return paymentMapper.toPaymentResponse(payment);
    }

    @Transactional
    public void deletePayment(Integer id) {
        Payment payment = checkPayment(id);
        paymentRepository.delete(payment);
    }

    private Payment checkPayment(Integer id) {
        return paymentRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.PAYMENT_NOT_EXISTED));
    }
} 