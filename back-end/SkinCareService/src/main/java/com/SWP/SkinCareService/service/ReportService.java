package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Report.ReportRequest;
import com.SWP.SkinCareService.dto.response.Report.ReportResponse;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.Report;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.mapper.ReportMapper;
import com.SWP.SkinCareService.repository.BookingRepository;
import com.SWP.SkinCareService.repository.ReportRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReportService {
    ReportRepository reportRepository;
    ReportMapper reportMapper;
    ServicesRepository servicesRepository;
    BookingRepository bookingRepository;


    //Response to client
    @Transactional
    public ReportResponse getReportToDashboard() {
        LocalDate today = LocalDate.now();
        Report report = reportRepository.findByDate(today);
        if (report == null) {
            Report newReport = createReport();
            updateTotalBooking();
            return reportMapper.toReportResponse(newReport);
        }

        updateTotalBooking();
        return reportMapper.toReportResponse(report);
    }

    //Use to manage
    @Transactional
    Report getReportToday() {
        LocalDate today = LocalDate.now();
        Report report = reportRepository.findByDate(today);
        if (report == null) {
            return createReport();
        }
        return reportRepository.findByDate(today);
    }

    public List<ReportResponse> getAllReportsBetween(LocalDate from, LocalDate to) {
        return reportRepository.findByDateBetween(from, to).stream().map(reportMapper::toReportResponse).toList();
    }


    public int totalNewBookingsBetween(LocalDate start, LocalDate end) {
        List<Report> reports = reportRepository.findByDateBetween(start, end);
        int total = 0;
        if (!reports.isEmpty()) {
            for (Report report : reports) {
                total += report.getTotalBooking();
            }
        }
        return total;
    }

    public BigDecimal totalRevenueBetween(LocalDate start, LocalDate end) {
        List<Report> reports = reportRepository.findByDateBetween(start, end);
        BigDecimal total = BigDecimal.ZERO;
        if (!reports.isEmpty()) {
            for (Report report : reports) {
                total = total.add(report.getRevenue());

            }
        }
        return total;
    }

    public int countTotalActiveServices() {
        return servicesRepository.countByActiveTrue();
    }

    @Transactional
    public Report createReport() {
        List<BookingStatus> status = List.of(BookingStatus.PENDING, BookingStatus.ON_GOING, BookingStatus.COMPLETED);
        LocalDateTime from = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<Booking> bookingList = bookingRepository.findAllByCreateAtBetweenAndStatusIn(from, to, status);
        int totalBooking = bookingList.size();
        Report report = Report.builder()
                .date(LocalDate.now())
                .revenue(BigDecimal.valueOf(0))
                .totalBooking(totalBooking)
                .build();
        return reportRepository.save(report);
    }

    @Transactional
    public void updateRevenue(BigDecimal price) {
        Report report = getReportToday();
        BigDecimal revenue = report.getRevenue().add(price);
        report.setRevenue(revenue);
        reportRepository.save(report);
    }

    @Transactional
    public void updateTotalBooking() {
        Report report = getReportToday();
        List<BookingStatus> status = List.of(BookingStatus.PENDING, BookingStatus.ON_GOING, BookingStatus.COMPLETED);
        LocalDateTime from = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<Booking> bookingList = bookingRepository.findAllByCreateAtBetweenAndStatusIn(from, to, status);
        int totalBooking = bookingList.size();
        report.setTotalBooking(totalBooking);
        reportRepository.save(report);
    }



}
