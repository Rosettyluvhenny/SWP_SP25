package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Receipt.ReceiptResponse;
import com.SWP.SkinCareService.service.ReceiptService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/receipt")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReceiptController {
    ReceiptService receiptService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReceiptResponse>>> getAllInDay(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        var result = receiptService.getAllReceiptsInDay(date);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<ReceiptResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ReceiptResponse>>> getAllBetween(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        var result = receiptService.getAllReceiptsBetween(from, to);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<ReceiptResponse>>builder()
                        .result(result)
                        .build()
        );
    }
}
