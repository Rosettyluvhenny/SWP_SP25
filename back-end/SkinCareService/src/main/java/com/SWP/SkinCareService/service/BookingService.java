package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.request.Notification.NotificationRequest;
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
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private NotificationService notificationService;

    @Transactional
    @PreAuthorize("hasRole('USER')")
    public BookingResponse createBooking(BookingRequest request) {
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
                if ((userBooking.getService().getServiceCategory().getType() == ServiceType.TREATMENT) && ServiceType.TREATMENT == service.getServiceCategory().getType()) {

                    List<BookingSession> sessionList = userBooking.getBookingSessions();
                    if (sessionList != null && !sessionList.isEmpty()) {
                        BookingSession lastSessionExisted = sessionList.getLast();
                        LocalDate lastSessionDateValid = lastSessionExisted.getBookingDate().plusDays(7);
                        LocalDate currentDate = request.getBookingTime().toLocalDate();

                        if (currentDate.isBefore(lastSessionDateValid)) {
                            if (lastSessionExisted.getBooking().getStatus() != BookingStatus.IS_CANCELED) {
                                throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                            }
                        } else {
                            if (lastSessionExisted.getBooking().getStatus() == BookingStatus.ON_GOING
                                    ||lastSessionExisted.getBooking().getStatus() == BookingStatus.PENDING ) {
                                throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                            }
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
        String text = "Dịch vụ "+booking.getService().getName()+" đã được đặt thành công";
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .url("http://localhost:3000/bookingDetail/"+booking.getId())
                .text(text)
                .userId(booking.getUser().getId())
                .isRead(false)
                .build();
        notificationService.create(notificationRequest);
        return result;
    }

    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(bookingMapper::toBookingResponse).toList();
    }

    @Transactional
    public BookingResponse requestPayment(int bookingId, String ipAddress) {
        Booking booking = checkBooking(bookingId);
        if (booking.getPayment().getDescription().equalsIgnoreCase("VNPAY") && (booking.getPaymentStatus() == PaymentStatus.PENDING) && booking.getUrl() == null) {
            VNPayPaymentRequestDTO vnpayRequest = VNPayPaymentRequestDTO.builder()
                    .bookingId(booking.getId())
                    .language("vn")
                    .build();
            String url = vnPayService.createPaymentUrl(vnpayRequest, ipAddress);
            booking.setUrl(url);
            bookingRepository.save(booking);
        } else {
            throw new AppException(ErrorCode.PAYMENT_REQUEST_REJECTED);
        }
        return bookingMapper.toBookingResponse(booking);
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
    @PostAuthorize("returnObject.user.username == authentication.name")
    public Booking cancelBooking(int id){
        Booking booking = checkBooking(id);
        booking.setStatus(BookingStatus.IS_CANCELED);
        booking.setPaymentStatus(PaymentStatus.CANCELLED);
        booking.setSessionRemain(0);
        List<BookingSession> sessionList = booking.getBookingSessions();
        if (sessionList != null && !sessionList.isEmpty()) {
            for (BookingSession session : sessionList) {
                if (session.getStatus() == BookingSessionStatus.PENDING) {
                    session.setStatus(BookingSessionStatus.IS_CANCELED);
                }
            }
        }
        String text = "Dịch vụ "+booking.getService().getName()+" của bạn đã bị huỷ";
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .url("http://localhost:3000/bookingDetail/"+booking.getId())
                .text(text)
                .userId(booking.getUser().getId())
                .isRead(false)
                .build();
        notificationService.create(notificationRequest);
        return bookingRepository.save(booking);
    }
    @Transactional
    @PostAuthorize("hasRole('STAFF')")
    public Booking updateStatus(int id, String status){
        Booking booking = checkBooking(id);
        String text = "";
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
                text = "Dịch vụ "+booking.getService().getName()+" của bạn đã được đặt hoàn tất";
            } else if (bookingStatus == BookingStatus.IS_CANCELED) {
                booking.setStatus(bookingStatus);
                List<BookingSession> sessionList = booking.getBookingSessions();
                if (sessionList != null && !sessionList.isEmpty()) {
                    for (BookingSession session : sessionList) {
                        session.setStatus(BookingSessionStatus.IS_CANCELED);
                    }
                }
                text = "Dịch vụ "+booking.getService().getName()+" của bạn đã bị huỷ";
            }

            NotificationRequest notificationRequest = NotificationRequest.builder()
                    .url("http://localhost:3000/bookingDetail/"+booking.getId())
                    .text(text)
                    .userId(booking.getUser().getId())
                    .isRead(false)
                    .build();
            notificationService.create(notificationRequest);
            return bookingRepository.save(booking);
        }catch(IllegalArgumentException e){
            throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
        }
    }

    //Check in
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

    public Page<BookingResponse> getAllByUser(String status, String payStatus, Pageable pageable){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String userId = user.getId();
        try {
            Specification<Booking> spec = (root, query, cb) -> {
                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
                predicates.add(cb.equal(root.get("user").get("id"), userId));
                if (status != null) {
                    try {
                        BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
                        predicates.add(cb.equal(root.get("status"), bookingStatus));
                    } catch (IllegalArgumentException e) {
                        throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
                    }
                }

                if (payStatus != null) {
                    try {
                        PaymentStatus paymentStatus = PaymentStatus.valueOf(payStatus.toUpperCase());
                        predicates.add(cb.equal(root.get("paymentStatus"), paymentStatus));
                    } catch (IllegalArgumentException e) {
                        throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
                    }
                }

                return cb.and(predicates.toArray(new Predicate[0]));
            };

            return bookingRepository.findAll(spec, pageable)
                    .map(bookingMapper::toBookingResponse);

        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
        }
    }

    @Transactional
    public BookingResponse getById(int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Booking booking = checkBooking(id);

        if (booking.getUrl() != null) {
            LocalDateTime timeRequestPaymentValid = booking.getUpdateAt().plusMinutes(15);
            LocalDateTime timeCheckPaymentValid = LocalDateTime.now();
            if (timeCheckPaymentValid.isAfter(timeRequestPaymentValid)) {
                booking.setUrl(null);
                updatePaymentStatus(id,"CANCELLED" );
                bookingRepository.save(booking);
            }
        }


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
            Specification<Booking> spec = (root, query, cb) -> {
                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
                predicates.add(cb.equal(root.get("userId"), user.getId()));
                return cb.and(predicates.toArray(new Predicate[0]));
            };
            return bookingRepository.findAll(spec, pageable).map(bookingMapper::toBookingResponse);
        }
    }


}