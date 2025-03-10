package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.request.Booking.StatusRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.dto.response.Booking.TherapistAvailabilityResponse;
import com.SWP.SkinCareService.dto.response.Booking.TimeSlotAvailabilityResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.enums.PaymentStatus;
import com.SWP.SkinCareService.enums.ServiceType;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BookingMapper;
import com.SWP.SkinCareService.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

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
    private BookingSessionService bookingSessionservice;
    private TherapistRepository therapistRepository;
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        //Check user
        User user = getUserById(request.getUserId());
        //Check Service
        Services service = getServiceById(request.getServiceId());
        //Check payment method
        Payment payment = getPaymentById(request.getPaymentId());
        //Check therapist
        Therapist therapist = getTherapistById(request.getTherapistId());
        //Get all booking of user
        Set<Booking> bookingList = user.getBooking();

        for (Booking booking : bookingList) {
            if (booking.getService().getType() == ServiceType.TREATMENT) {
                BookingSession session = booking.getBookingSessions().getLast();
                LocalDate lastSessionDateValid = session.getBookingDate().plusDays(7);
                LocalDate currentDate = request.getBookingTime().toLocalDate();
                if (currentDate.isBefore(lastSessionDateValid)) {
                    throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                }
            }
        }


        Booking booking = bookingMapper.toBooking(request);



        booking.setUser(user);
        booking.setService(service);
        booking.setPayment(payment);
        booking.setSessionRemain(service.getSession());
        booking.setStatus(BookingStatus.PENDING);
        bookingRepository.save(booking);
        bookingRepository.flush();
        //Create first session
        BookingSessionRequest session =  BookingSessionRequest.builder()
                .bookingId(booking.getId())
                .sessionDateTime(request.getBookingTime())
                .therapistId(request.getTherapistId())
                .note(request.getNotes())
                .build();

        bookingSessionservice.createBookingSession(session);
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
    public BookingResponse updateBooking(int id, BookingUpdateRequest request) {
        Booking booking = checkBooking(id);
        BookingStatus status = Enum.valueOf(BookingStatus.class, request.getStatus().toUpperCase());
        booking.setStatus(status);
        bookingMapper.updateBooking(request, booking);
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

    Payment getPaymentById(int id) {
        return paymentRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.PAYMENT_NOT_EXISTED));
    }

    Therapist getTherapistById(String id) {
        return therapistRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }

//    boolean checkTherapistAvailable(String therapistId, LocalDateTime requestTime, int requestDuration) {
//        LocalDateTime startOfDay = requestTime.toLocalDate().atStartOfDay();
//        LocalDateTime endOfDay = startOfDay.plusDays(1);
//        //Get all active booking in day
//        List<BookingSessionStatus> excludeStatus = List.of(BookingSessionStatus.IS_CANCELED);
//        List<BookingSession> existingBookings = bookingSessionRepository.findByTherapistIdAndBookingTimeBetweenAndStatusNotIn(
//                therapistId,
//                startOfDay,
//                endOfDay,
//                excludeStatus
//        );
//
//        for (BookingSession existing : existingBookings) {
//            LocalDateTime requestEndtime = requestTime.plusMinutes(requestDuration);
//            LocalDateTime existingStartTime = existing.getBookingTime();
//            LocalDateTime existingEndTime = existingStartTime.plusMinutes(existing.getBooking().getService().getDuration());
//
//
//            if (((requestTime.isAfter(existingStartTime) && requestTime.isBefore(existingEndTime))
//                    || ((requestEndtime.isAfter(existingStartTime) && requestEndtime.isBefore(existingEndTime))
//                    || (requestTime.isBefore(existingStartTime) && requestEndtime.isAfter(existingEndTime))))
//                    || (requestTime.isEqual(existingStartTime) && requestEndtime.isEqual(existingEndTime)))
//            {
//                return false;
//            }
//        }
//        return true;
//    }

    public void updateStatus(int id, StatusRequest status){
        Booking booking = bookingRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.getStatus().toUpperCase());
            booking.setStatus(bookingStatus);
            bookingRepository.save(booking);
        }catch(IllegalArgumentException e){
            throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
        }
    }
    /**
     * Method 1: Find available time slots for a specific therapist on a specific date
     * @param therapistId The ID of the therapist
     * @param serviceId The ID of the service
     * @param bookingDate The date to check availability for
     * @return List of available time slots for the specified therapist
     */


}