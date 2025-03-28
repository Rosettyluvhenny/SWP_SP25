package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Report.ReportResponse;
import com.SWP.SkinCareService.service.ReportService;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/report")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReportController {
    ReportService reportService;

    @GetMapping()
    public ResponseEntity<ApiResponse<ReportResponse>> getReportToday() {
        var result = reportService.getReportToDashboard();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<ReportResponse>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getAllReportsBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        var result = reportService.getAllReportsBetween(from, to);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<ReportResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/totalBookings")
    public ResponseEntity<ApiResponse<Integer>> totalBookingBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        var result = reportService.totalNewBookingsBetween(from, to);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<Integer>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/totalRevenue")
    public ResponseEntity<ApiResponse<BigDecimal>> totalRevenueBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        var result = reportService.totalRevenueBetween(from, to);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<BigDecimal>builder()
                        .result(result)
                        .build()
        );
    }

    @GetMapping("/totalActiveService")
    public ResponseEntity<ApiResponse<Integer>> totalActiveService() {
        var result = reportService.countTotalActiveServices();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<Integer>builder()
                        .result(result)
                        .build()
        );
    }
}
