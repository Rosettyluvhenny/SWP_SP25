package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    boolean existsByName(String paymentName);
}
