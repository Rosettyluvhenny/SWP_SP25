package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.response.Report.ReportResponse;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.Report;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.enums.PaymentStatus;
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
import java.util.ArrayList;
import java.util.Comparator;
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
            Report newReport = createReportCustomDay(today);
            updateTotalBookingCustomDay(today);
            return reportMapper.toReportResponse(newReport);
        }

        updateTotalBookingCustomDay(today);
        return reportMapper.toReportResponse(report);
    }

    @Transactional
    Report getReportCustomDay(LocalDate date) {
        Report report = reportRepository.findByDate(date);
        if (report == null) {
            return createReportCustomDay(date);
        }
        return reportRepository.findByDate(date);
    }


    @Transactional
    public List<ReportResponse> getAllReportsBetween(LocalDate from, LocalDate to) {
        if (to == null) {
            to = LocalDate.now();
        }
        if (from == null) {
            from = to.minusDays(6);
        }
        if (to.isAfter(LocalDate.now())) {
            to = LocalDate.now();
        }
        List<Report> reportList = reportRepository.findByDateBetween(from, to);
        if (reportList.size() != ((int) ChronoUnit.DAYS.between(from, to)) + 1) {
            List<Report> newReportList = new ArrayList<>();
            for (long i = 0; i <= ChronoUnit.DAYS.between(from,to); i++) {
                Report newReport = getReportCustomDay(from.plusDays(i));
                updateTotalBookingCustomDay(from.plusDays(i));
                updateRevenueCustomDay(from.plusDays(i));
                newReportList.add(newReport);
            }
            newReportList.sort(Comparator.comparing(Report::getDate));
            return newReportList.stream().map(reportMapper::toReportResponse).toList();
        }
        reportList.sort(Comparator.comparing(Report::getDate));
        for (Report report : reportList) {
            updateRevenueCustomDay(report.getDate());
            updateTotalBookingCustomDay(report.getDate());
        }
        return reportList.stream().map(reportMapper::toReportResponse).toList();
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
    public Report createReportCustomDay(LocalDate day) {
        List<BookingStatus> status = List.of(BookingStatus.PENDING, BookingStatus.ON_GOING, BookingStatus.COMPLETED);
        LocalDateTime from = day.atTime(0,0,0,0);
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<Booking> bookingList = bookingRepository.findAllByCreateAtBetweenAndStatusIn(from, to, status);
        int totalBooking = bookingList.size();
        BigDecimal totalRevenue = BigDecimal.ZERO;
        for (Booking booking : bookingList) {
            if (booking.getPaymentStatus().equals(PaymentStatus.PAID)) {
                totalRevenue = totalRevenue.add(booking.getPrice());
            }
        }
        Report report = Report.builder()
                .date(day)
                .revenue(totalRevenue)
                .totalBooking(totalBooking)
                .build();
        return reportRepository.save(report);
    }

    @Transactional
    public void updateRevenueCustomDay(LocalDate day) {
        Report report = getReportCustomDay(day);
        List<BookingStatus> status = List.of(BookingStatus.PENDING, BookingStatus.ON_GOING, BookingStatus.COMPLETED);
        LocalDateTime from = day.atTime(0,0,0,0);
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<Booking> bookingList = bookingRepository.findAllByCreateAtBetweenAndStatusIn(from, to, status);
        BigDecimal totalRevenue = BigDecimal.ZERO;
        for (Booking booking : bookingList) {
            if (booking.getPaymentStatus().equals(PaymentStatus.PAID)) {
                totalRevenue = totalRevenue.add(booking.getPrice());
            }
        }
        report.setRevenue(totalRevenue);
        reportRepository.save(report);
    }

    @Transactional
    public void updateTotalBookingCustomDay(LocalDate day) {
        Report report = getReportCustomDay(day);
        List<BookingStatus> status = List.of(BookingStatus.PENDING, BookingStatus.ON_GOING, BookingStatus.COMPLETED);
        LocalDateTime from = day.atTime(0,0,0,0);
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<Booking> bookingList = bookingRepository.findAllByCreateAtBetweenAndStatusIn(from, to, status);
        int totalBooking = bookingList.size();
        report.setTotalBooking(totalBooking);
        reportRepository.save(report);
    }



}
