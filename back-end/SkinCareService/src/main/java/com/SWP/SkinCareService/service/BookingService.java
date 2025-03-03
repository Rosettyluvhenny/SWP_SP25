package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.BookingRequest;
import com.SWP.SkinCareService.dto.response.BookingResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BookingMapper;
import com.SWP.SkinCareService.repository.BookingRepository;
import com.SWP.SkinCareService.repository.PaymentRepository;
import com.SWP.SkinCareService.repository.ServicesRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BookingService {
    private BookingRepository bookingRepository;
    private BookingMapper bookingMapper;
    private UserRepository userRepository;
    private ServicesRepository servicesRepository;
    private PaymentRepository paymentRepository;


    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        //Check user
        User user = getUserById(request.getUserId());
        //Check staff
        User staff = getUserById(request.getStaffId());
        //Check Service
        Services service = getServiceById(request.getServiceId());
        //Check payment method
        Payment payment = getPaymentById(request.getPaymentId());

        Booking booking = bookingMapper.toBooking(request);

        booking.setUser(user);
        booking.setStaff(staff);
        booking.setService(service);
        booking.setPayment(payment);

        bookingRepository.save(booking);

        return bookingMapper.toBookingResponse(booking);
    }

    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(bookingMapper::toBookingResponse).toList();
    }

    public BookingResponse getBookingById(int id) {
        /*
        return bookingMapper.toBookingResponse(bookingRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.BOOKING_NOT_EXISTED)));
         */
        return bookingMapper.toBookingResponse(checkBooking(id));
    }

    @Transactional
    public BookingResponse updateBooking(int id, BookingRequest request) {
        Booking booking = checkBooking(id);

        //Check user
        User user = getUserById(request.getUserId());
        //Check staff
        User staff = getUserById(request.getStaffId());
        //Check Service
        Services service = getServiceById(request.getServiceId());
        //Check payment method
        Payment payment = getPaymentById(request.getPaymentId());

        bookingMapper.updateBooking(request, booking);
        
        booking.setUser(user);
        booking.setStaff(staff);
        booking.setService(service);
        booking.setPayment(payment);
        booking.setStatus(request.getStatus());
        booking.setPaymentStatus(request.getPaymentStatus());
        booking.setNotes(request.getNotes());
        booking.setSessionRemain(request.getSessionRemain());
        booking.setPrice(request.getPrice());

        bookingRepository.save(booking);

        return bookingMapper.toBookingResponse(booking);
    }

    public void deleteBooking(int id) {
        Booking booking = checkBooking(id);
        bookingRepository.delete(booking);
    }

    Booking checkBooking(int id) {
        return bookingRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
    }

    User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    Services getServiceById(int id) {
        return servicesRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
    }

    Payment getPaymentById(long id) {
        return paymentRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.PAYMENT_METHOD_NOT_EXISTED));
    }

}
