package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.BookingUpdateRequest;
import com.SWP.SkinCareService.dto.request.Notification.NotificationRequest;
import com.SWP.SkinCareService.dto.request.VNPAY.VNPayPaymentRequestDTO;
import com.SWP.SkinCareService.dto.response.Booking.BookingResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.*;
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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    ReceiptRepository receiptRepository;
    SupabaseService supabaseService;

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

        LocalDateTime from = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime to = from.plusDays(1).minusNanos(1);
        List<BookingStatus> statuses = List.of(BookingStatus.IS_CANCELED, BookingStatus.PENDING);
        List<Booking> bookingToday = bookingRepository.findAllByUserAndCreateAtBetweenAndStatusIn(user, from, to, statuses);
        if (bookingToday.size() > 7) {
            throw new AppException(ErrorCode.SPAM_REJECTED);
        }

        Set<Booking> userBookingExisted = user.getBooking();
        if (userBookingExisted != null && !userBookingExisted.isEmpty()) {
            for (Booking userBooking : userBookingExisted) {
                if ((userBooking.getService().getServiceCategory().getType() == ServiceType.TREATMENT) && ServiceType.TREATMENT == service.getServiceCategory().getType()) {
                    //Check all session in booking
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
                } else {
                    if (userBooking.getService().getServiceCategory().getType() == service.getServiceCategory().getType()) {
                        if (userBooking.getStatus() == BookingStatus.ON_GOING || userBooking.getStatus() == BookingStatus.PENDING) {
                            throw new AppException(ErrorCode.BOOKING_REJECTED);
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
    public void updatePaymentStatus(int id, String paymentStatus, String paymentType, MultipartFile img) throws IOException {
        Booking booking = checkBooking(id);
        LocalDateTime now = LocalDateTime.now();
        for(var session : booking.getBookingSessions()){
            if(!session.getStatus().equals(BookingSessionStatus.PENDING)&&!session.getStatus().equals(BookingSessionStatus.WAITING))
                continue;
            if(now.isBefore(session.getSessionDateTime().minusMinutes(40))){
                throw new AppException(ErrorCode.BOOKING_IS_SOON_IN_TIME);
            }
            if(now.isAfter(session.getSessionDateTime().plusMinutes(20)))
                throw new AppException(ErrorCode.BOOKING_IS_LATE_IN_TIME);
        }
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User staff = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            boolean isStaff = staff.getRoles().stream()
                    .anyMatch(role -> role.getName().equals("STAFF"));  // Assuming your Role entity has a getName() method

            if (isStaff) {
                booking.setStaff(staff);
            }

            PaymentStatus status = PaymentStatus.valueOf(paymentStatus.toUpperCase());
            PaymentType type = PaymentType.valueOf(paymentType.toUpperCase());
            if (type == PaymentType.ONLINE_BANKING) {
                if (img.isEmpty()) {
                    throw new AppException(ErrorCode.MISSING_IMAGE);
                }
            }

            if (status == PaymentStatus.PAID) {
                updateStatus(id, "ON_GOING");
                if (booking.getPaymentStatus() == PaymentStatus.PAID) {
                    throw new AppException(ErrorCode.BOOKING_ALREADY_PAID);
                }
                booking.setPaymentStatus(status);
                Receipt receipt = Receipt.builder()
                        .payment(booking.getPayment())
                        .paymentType(type)
                        .amount(booking.getPrice())
                        .serviceName(booking.getService().getName())
                        .customerName(booking.getUser().getFullName())
                        .date(LocalDateTime.now())
                        .staff(staff)
                        .build();
                receiptRepository.save(receipt);
                if (img != null) {
                    String url = supabaseService.uploadImage(img, "Receipt_"+receipt.getId());
                    receipt.setUrl(url);
                }
                receiptRepository.flush();

            } else if (status == PaymentStatus.CANCELLED) {
                updateStatus(id, "IS_CANCELED");
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
    public BookingResponse getById(int id) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Booking booking = checkBooking(id);

        if (booking.getUrl() != null) {
            LocalDateTime timeRequestPaymentValid = booking.getUpdateAt().plusMinutes(15);
            LocalDateTime timeCheckPaymentValid = LocalDateTime.now();
            if (timeCheckPaymentValid.isAfter(timeRequestPaymentValid)) {
                booking.setUrl(null);
                updatePaymentStatus(id,"CANCELLED", "CANCELLED",null);
                bookingRepository.save(booking);
            }
        }

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)  // Assuming Role has a getName() method
                .collect(Collectors.toSet());
        log.info("check"+user.getRoles());
        if(roleNames.contains("ADMIN")|| roleNames.contains("STAFF") || user.getId().equals(booking.getUser().getId()))
            return bookingMapper.toBookingResponse(
                    bookingRepository.findById(id).orElseThrow(
                            () -> new AppException(ErrorCode.BOOKING_NOT_EXISTED)));
        else
            throw new AppException(ErrorCode.UNAUTHORIZED);
    }
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public Page<BookingResponse> getAllByStaff(String phone, LocalDate startDate, LocalDate endDate,String status, Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority author : authentication.getAuthorities()) {
            log.info(author.getAuthority());
        }
        User user;
        if(phone!= null)
             user =userRepository.findByPhone(phone)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        else {
            user = null;
        }

        if(phone!=null && user == null)
            return null;
        Specification<Booking> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

                // Always add user ID filter
            if(user !=null)
                predicates.add(cb.equal(root.get("user").get("id"), user.getId()));

                // Handle date filtering
            if (startDate != null && endDate != null) {
                    // Both start and end dates are provided
                    predicates.add(cb.between(root.get("createAt"), startDate, endDate));
            } else if (startDate != null) {
                    // Only start date is provided
                    predicates.add(cb.greaterThanOrEqualTo(root.get("createAt"), startDate));
            } else if (endDate != null) {
                    // Only end date is provided
                predicates.add(cb.lessThanOrEqualTo(root.get("createAt"), endDate));
            }

            if (status != null) {
                try {
                    BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), bookingStatus));
                } catch (IllegalArgumentException e) {
                    throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
            };

            return bookingRepository.findAll(spec, pageable).map(bookingMapper::toBookingResponse);

    }

    @Scheduled(fixedRate = 60000) // Runs every 60 seconds (adjust as needed)
    public void autoCancelExpiredSessions() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);

        List<Booking> expiredBookings = bookingRepository
                .findByStatusInAndBookingSessions_SessionDateTimeBefore(
                        List.of(BookingStatus.PENDING),
                        threshold
                );

        expiredBookings.forEach(session -> session.setStatus(BookingStatus.IS_CANCELED));
        bookingRepository.saveAll(expiredBookings);

        System.out.println("Auto-canceled " + expiredBookings.size() + " expired bookings.");
    }
}