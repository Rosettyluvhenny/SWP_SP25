package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.request.VNPAY.VNPayPaymentRequestDTO;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private VNPayService vnPayService;

    @Transactional
    @PreAuthorize("hasRole('USER')")
    public BookingResponse createBooking(BookingRequest request, String ipAddress) {
        //Check user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        //Check Service
        Services service = getServiceById(request.getServiceId());
        //Check payment method
        Payment payment = getPaymentById(request.getPaymentId());
        //Get all booking of user

        Set<Booking> userBookingExisted = user.getBooking();
        if (userBookingExisted != null && !userBookingExisted.isEmpty()) {
            for (Booking userBooking : userBookingExisted) {
                if ((userBooking.getService().getType() == ServiceType.TREATMENT) && ServiceType.TREATMENT == service.getType()) {

                    List<BookingSession> sessionList = userBooking.getBookingSessions();
                    if (sessionList != null && !sessionList.isEmpty()) {
                        BookingSession lastSessionExisted = sessionList.getLast();
                        LocalDate lastSessionDateValid = lastSessionExisted.getBookingDate().plusDays(7);
                        LocalDate currentDate = request.getBookingTime().toLocalDate();

                        if (currentDate.isBefore(lastSessionDateValid) || lastSessionExisted.getBooking().getStatus() != BookingStatus.COMPLETED) {
                            throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                        }
                    }
                }
            }
        }

        //Set data and save
        Booking booking = bookingMapper.toBooking(request);
        booking.setUser(user);
        booking.setService(service);
        booking.setPrice(service.getPrice());
        booking.setPayment(payment);
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setSessionRemain(service.getSession());
        bookingRepository.save(booking);
        bookingRepository.flush();
        //Set data and save
        BookingSessionRequest rq = BookingSessionRequest.builder()
                .bookingId(booking.getId())
                .sessionDateTime(request.getBookingTime())
                .note(request.getNotes())
                .therapistId(request.getTherapistId())
                .build();
        bookingSessionService.createBookingSession(rq);
        BookingResponse result = bookingMapper.toBookingResponse(booking);
        bookingRepository.flush();
        result.setImg(booking.getService().getImg());
        if (payment.getDescription().equalsIgnoreCase("VNPAY")) {
            VNPayPaymentRequestDTO vnpayRequest = VNPayPaymentRequestDTO.builder()
                    .bookingId(booking.getId())
                    .language("vn")
                    .build();

            String url = vnPayService.createPaymentUrl(vnpayRequest, ipAddress);
            result.setUrl(url);
        }

        return result;
    }

    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(bookingMapper::toBookingResponse).toList();
    }


    @Transactional
    public BookingResponse updateBooking(int id, BookingUpdateRequest request) {
        Booking booking = checkBooking(id);
        BookingStatus status = Enum.valueOf(BookingStatus.class, request.getStatus().toUpperCase());
        booking.setStatus(status);
        bookingMapper.updateBooking(request, booking);
        return bookingMapper.toBookingResponse(booking);
    }
    @Transactional
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
    @PostAuthorize("hasRole('STAFF') or (hasRole('USER') and returnObject.user.username == authentication.name)")
    public Booking updateStatus(int id, String status){
        Booking booking = checkBooking(id);
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User staff = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            boolean isStaff = staff.getRoles().stream()
                    .anyMatch(role -> role.getName().equals("STAFF"));  // Assuming your Role entity has a getName() method

            if (bookingStatus == BookingStatus.ON_GOING) {
                if (!isStaff) {
                    throw new AppException(ErrorCode.NOT_HAVE_PERMISSIONS);
                }
                booking.setStatus(bookingStatus);
                List<BookingSession> sessionList = booking.getBookingSessions();
                if (sessionList != null && !sessionList.isEmpty()) {
                    for (BookingSession session : sessionList) {
                        if (session.getStatus() == BookingSessionStatus.PENDING) {
                            session.setStatus(BookingSessionStatus.WAITING);
                        }
                    }
                }
            } else if (bookingStatus == BookingStatus.IS_CANCELED) {
                booking.setStatus(bookingStatus);
                List<BookingSession> sessionList = booking.getBookingSessions();
                if (sessionList != null && !sessionList.isEmpty()) {
                    for (BookingSession session : sessionList) {
                        session.setStatus(BookingSessionStatus.IS_CANCELED);
                    }
                }
            }
            return bookingRepository.save(booking);
        }catch(IllegalArgumentException e){
            throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
        }
    }

    @Transactional
    @PostAuthorize("hasRole('STAFF')")
    public void updatePaymentStatus(int id, String paymentStatus){
        Booking booking = checkBooking(id);
        try {
            PaymentStatus status = PaymentStatus.valueOf(paymentStatus.toUpperCase());
            booking.setPaymentStatus(status);
            if (status == PaymentStatus.PAID) {
                updateStatus(id, "ON_GOING");
            } else if (status == PaymentStatus.CANCELLED) {
                updateStatus(id, "IS_CANCELED");
            }
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User staff = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            boolean isStaff = staff.getRoles().stream()
                    .anyMatch(role -> role.getName().equals("STAFF"));  // Assuming your Role entity has a getName() method

            if (isStaff) {
                booking.setStaff(staff);
            }
            bookingRepository.save(booking);
        } catch (IllegalArgumentException e){
            throw new AppException(ErrorCode.PAYMENT_STATUS_INVALID);
        }
    }

    public Page<BookingResponse> getAllByUser( Pageable pageable){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String userId = user.getId();
        return bookingRepository.findAllByUserId(userId, pageable).map(bookingMapper::toBookingResponse);
    }


    public BookingResponse getById(int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Booking booking = checkBooking(id);
        if(user.getRoles().contains("ADMIN")|| user.getId().equals(booking.getUser().getId()))
            return bookingMapper.toBookingResponse(
                    bookingRepository.findById(id).orElseThrow(
                            () -> new AppException(ErrorCode.BOOKING_NOT_EXISTED)));
        else
            throw new AppException(ErrorCode.UNAUTHORIZED);
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