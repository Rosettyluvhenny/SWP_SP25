package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.BookingRequest;
import com.SWP.SkinCareService.dto.request.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.response.BookingResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.enums.PaymentStatus;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
    private BookingSessionRepository bookingSessionRepository;
    private TherapistRepository therapistRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        //Check user
        User user = getUserById(request.getUserId());
        //Check staff
        //User staff = getUserById(request.getStaffId());
        //Check Service
        Services service = getServiceById(request.getServiceId());
        //Check payment method
        Payment payment = getPaymentById(request.getPaymentId());
        //Check therapist
        Therapist therapist = getTherapistById(request.getTherapistId());
        //Get all booking of user
        Set<Booking> bookingList = user.getBooking();
        //Check duplicate booking in one service
        for (Booking booking : bookingList) {
            if (booking.getService().equals(service)) {
                if (booking.getStatus() == BookingStatus.ON_GOING) {
                    throw new AppException(ErrorCode.BOOKING_ON_GOING);
                }
            }
        }

        Booking booking = bookingMapper.toBooking(request);
        LocalDateTime time = request.getBookingTime();

        //Check time available or not
        if (!checkTherapistAvailable(therapist.getId(),time,service.getDuration())) {
            throw new AppException(ErrorCode.THERAPIST_NOT_AVAILABLE);
        }

        booking.setUser(user);
        //booking.setStaff(staff);
        booking.setService(service);
        booking.setPayment(payment);
        booking.setSessionRemain(service.getSession());
        bookingRepository.save(booking);
        //Create first session
        BookingSession bookingSession = new BookingSession();
        bookingSession.setBooking(booking);
        bookingSession.setBookingTime(request.getBookingTime());
        bookingSession.setNote(request.getNotes());
        bookingSession.setTherapist(therapist);
        bookingSessionRepository.save(bookingSession);

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

        booking.setPayment(payment);
        booking.setPaymentStatus(PaymentStatus.valueOf(request.getPaymentStatus().toUpperCase()));
        booking.setNotes(request.getNotes());
        if (booking.getService().equals(service)) {
            booking.setSessionRemain(request.getSessionRemain());
        } else {
            booking.setSessionRemain(service.getSession());
        }

        booking.setService(service);
        booking.setPrice(service.getPrice());

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

    Therapist getTherapistById(String id) {
        return therapistRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }

    boolean checkTherapistAvailable(String therapistId, LocalDateTime requestTime, int requestDuration) {
        LocalDateTime startOfDay = requestTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        //Get all active booking in day
        List<BookingSessionStatus> excludeStatus = List.of(BookingSessionStatus.IS_CANCELED);
        List<BookingSession> existingBookings = bookingSessionRepository.findByTherapistIdAndBookingTimeBetweenAndStatusNotIn(
                therapistId,
                startOfDay,
                endOfDay,
                excludeStatus
        );

        for (BookingSession existing : existingBookings) {
            //System.out.println(existing);
            LocalDateTime requestEndtime = requestTime.plusMinutes(requestDuration);
            LocalDateTime existingStartTime = existing.getBookingTime();
            LocalDateTime existingEndTime = existingStartTime.plusMinutes(existing.getBooking().getService().getDuration());


            if (((requestTime.isAfter(existingStartTime) && requestTime.isBefore(existingEndTime)) || ((requestEndtime.isAfter(existingStartTime) && requestEndtime.isBefore(existingEndTime)) || (requestTime.isBefore(existingStartTime) && requestEndtime.isAfter(existingEndTime)))) || (requestTime.isEqual(existingStartTime) && requestEndtime.isEqual(existingEndTime)))
            {
                System.out.println(existingStartTime);
                System.out.println(existingEndTime);
                System.out.println(requestTime);
                System.out.println("------------");
                return false;
            }
        }
        return true;
    }

}