package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.Receipt.ReceiptResponse;
import com.SWP.SkinCareService.entity.Receipt;
import com.SWP.SkinCareService.mapper.ReceiptMapper;
import com.SWP.SkinCareService.repository.ReceiptRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReceiptService {
    ReceiptRepository receiptRepository;
    ReceiptMapper receiptMapper;

    public List<ReceiptResponse> getAllReceiptsInDay(LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        LocalDateTime from = date.atStartOfDay();
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<Receipt> receiptList = receiptRepository.findAllByDateBetween(from, to);
        return receiptList.stream().map(receiptMapper::toResponse).toList();
    }

    public List<ReceiptResponse> getAllReceiptsBetween(LocalDate from, LocalDate to) {
        if (to == null) {
            to = LocalDate.now();
        }
        if (from == null) {
            from = to.minusDays(6);
        }
        LocalDateTime begin = from.atStartOfDay();
        LocalDateTime end = to.atStartOfDay().plusDays(1).minusNanos(1);
        List<Receipt> receiptList = receiptRepository.findAllByDateBetween(begin, end);
        return receiptList.stream().map(receiptMapper::toResponse).toList();
    }
}
