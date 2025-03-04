package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.Payment;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BookingMapper;
import com.SWP.SkinCareService.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingService {
    BookingRepository bookingRepository;
    PaymentRepository paymentRepository;
    UserRepository userRepository;
    TherapistRepository therapistRepository;
    BookingMapper bookingMapper;
    ServicesRepository servicesRepository;

    @Transactional
    public BookingResponse create(BookingRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info(authentication.toString());
        String userId = authentication.getName();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Booking booking = bookingMapper.toBooking(request);
        booking.setUser(user);

        Services service = servicesRepository.findById(request.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));

        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_EXISTED));

        booking.setService(service);
        booking.setPayment(payment);
        booking.setSessionRemain(service.getSession());
        booking.setPrice(service.getPrice());

        bookingRepository.save(booking);
        bookingRepository.flush();

        return bookingMapper.toResponse(booking);
    }

    public Page<BookingResponse> getAllByUser(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Page<Booking> bookings = bookingRepository.findAllByUserId(userId, pageable);
        return bookings.map(bookingMapper::toResponse);
    }

    public Page<BookingResponse> getAllByStaff(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffId = authentication.getName();

        Page<Booking> bookings = bookingRepository.findAllByStaffId(staffId, pageable);
        return bookings.map(bookingMapper::toResponse);
    }

    public BookingResponse getById(int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));

        if (!booking.getUser().getId().equals(userId) && !booking.getStaff().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return bookingMapper.toResponse(booking);
    }
}
