package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReceiptRepository extends JpaRepository<Receipt, Integer> {
  List<Receipt> findAllByDateBetween(LocalDateTime from, LocalDateTime to);
  }