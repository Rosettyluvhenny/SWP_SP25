package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.entity.*;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private TherapistRepository therapistRepository;
    private BookingSessionService bookingSessionService;
    SupabaseService supabaseService;
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        //Check user
        User user = getUserById(request.getUserId());
        //Check Service
        Services service = getServiceById(request.getServiceId());
        //Check payment method
        Payment payment = getPaymentById(request.getPaymentId());
        //Create first session
        BookingSession bookingSession = new BookingSession();
        //Get time booking
        LocalDateTime time = request.getBookingTime();
        //Check therapist
        //Get all booking of user
        Set<Booking> bookingList = user.getBooking();
        if(bookingList!=null && !bookingList.isEmpty() ) {
            for (Booking booking : bookingList) {
                if ((booking.getService().getType() == ServiceType.TREATMENT) && (booking.getService().getType() == service.getType())) {
                    BookingSession session = booking.getBookingSessions().getLast();
                    LocalDate lastSessionDateValid = session.getBookingDate().plusDays(7);
                    LocalDate currentDate = request.getBookingTime().toLocalDate();
                    if (currentDate.isBefore(lastSessionDateValid) || session.getBooking().getStatus() != BookingStatus.COMPLETED) {
                        throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                    }
                }
            }
        }

        //Set data and save
        Booking booking = bookingMapper.toBooking(request);
        booking.setUser(user);
        booking.setService(service);
        booking.setPayment(payment);
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setSessionRemain(service.getSession());
        bookingRepository.save(booking);
        //Set data and save
        BookingSessionRequest rq = BookingSessionRequest.builder()
                .bookingId(booking.getId())
                .sessionDateTime(request.getBookingTime())
                .note(request.getNote())
                .therapistId(request.getTherapistId())
                        .build();
        bookingSessionService.createBookingSession(rq);
        BookingResponse result = bookingMapper.toBookingResponse(booking);
        bookingRepository.flush();
        result.setImg(supabaseService.getImage(booking.getService().getImg()));
        return result;
    }

    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(bookingMapper::toBookingResponse).toList();
    }

    public BookingResponse getBookingById(int id) {
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
    @Transactional
    public void updateStatus(int id, String status){
        Booking booking = bookingRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            booking.setStatus(bookingStatus);
            bookingRepository.save(booking);
        }catch(IllegalArgumentException e){
            throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
        }
    }

    public Page<BookingResponse> getAllByUser( Pageable pageable){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String userId = user.getId();
        return bookingRepository.findAllByUserId(userId, pageable).map(bookingMapper::toBookingResponse);
    }


    public BookingResponse getById(int id) {
        return bookingMapper.toBookingResponse(
                bookingRepository.findById(id).orElseThrow(
                        () -> new AppException(ErrorCode.BOOKING_NOT_EXISTED)));
    }

    public Page<BookingResponse> getAllByStaff(String phone, Pageable pageable) {
        if(phone ==null)
            return bookingRepository.findAll(pageable).map(bookingMapper::toBookingResponse);
        else{
            User user = userRepository.findByPhone(phone).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
            return bookingRepository.findAllByUserId(user.getId(), pageable).map(bookingMapper::toBookingResponse);
        }
    }
}