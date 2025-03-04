package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.Payment;
import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.enums.BookingStatus;
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

import java.io.IOException;

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
    SupabaseService supabaseService;
    @Transactional
    public BookingResponse create(BookingRequest request) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        log.info(username);

        User user = userRepository.findByUsername(username)
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
        var result = bookingMapper.toResponse(booking);
        result.setImg(supabaseService.getImage(result.getImg()));
        return result;
    }

    public Page<BookingResponse> getAllByUser(Pageable pageable) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        User user = userRepository.findByUsername(name).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        Page<Booking> bookings = bookingRepository.findAllByUserId(user.getId(), pageable);

        return bookings.map(booking -> {
            BookingResponse result = bookingMapper.toResponse(booking);
            try {
                result.setImg(supabaseService.getImage(result.getImg()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return result;
        });
    }

    public Page<BookingResponse> getAllByStaff(Pageable pageable) {
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(bookingMapper::toResponse);
    }

    public Page<BookingResponse> getAllByUserPhone(String phone,Pageable pageable) {
        User user = userRepository.findByPhone(phone).orElseThrow(()-> new AppException(ErrorCode.PHONE_NOT_EXISTED));
        Page<Booking> bookings = bookingRepository.findAllByUserId(user.getId(), pageable);
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

    public BookingResponse updateStatus(int id,String status){
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        try {
            BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
            booking.setStatus(newStatus);
            bookingRepository.save(booking);

            return bookingMapper.toResponse(booking);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_STATUS, "Invalid status: " + status);
        }

    }

}
