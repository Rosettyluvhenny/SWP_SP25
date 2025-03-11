package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingRequest;
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
    private BookingSessionRepository bookingSessionRepository;
    private TherapistRepository therapistRepository;
    private TherapistService therapistService;
    private RoomService roomService;
    private BookingSessionService bookingSessionService;

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
        if (request.getTherapistId() != null) {
            Therapist therapist = getTherapistById(request.getTherapistId());
            Set<Services> serviceSupport = therapist.getServices();
            if (!serviceSupport.contains(service)) {
                throw new AppException(ErrorCode.THERAPIST_NOT_SUPPORTED);
            }
            //Check time available or not
            if (!bookingSessionService.isTherapistAvailable(therapist.getId(), time, service.getDuration())) {
                throw new AppException(ErrorCode.THERAPIST_NOT_AVAILABLE);
            }
            //Set therapist if available
            bookingSession.setTherapist(therapist);
        } else {
            //If user doesn't assign the therapist, system will auto set therapist
            List<Therapist> therapists = therapistService.getTherapistAvailableForService(request.getServiceId(), time);
            List<Therapist> availableTherapists = therapistRepository.findAllByServicesId(request.getServiceId());
            therapists.retainAll(availableTherapists);

            if (therapists.isEmpty()) {
                throw new AppException(ErrorCode.OUT_OF_THERAPIST);
            }
            Therapist therapist = therapists.getFirst();
            bookingSession.setTherapist(therapist);
        }
        //Get all booking of user
        Set<Booking> bookingList = user.getBooking();
        for (Booking booking : bookingList) {
            if ((booking.getService().getType() == ServiceType.TREATMENT) && (booking.getService().getType() == service.getType()))  {
                BookingSession session = booking.getBookingSessions().getLast();
                LocalDate lastSessionDateValid = session.getBookingDate().plusDays(7);
                LocalDate currentDate = request.getBookingTime().toLocalDate();
                if (currentDate.isBefore(lastSessionDateValid) || session.getBooking().getStatus() != BookingStatus.COMPLETED) {
                    throw new AppException(ErrorCode.BOOKING_DATE_NOT_ALLOWED);
                }
            }
        }
        //Assign Room for session
        List<Room> roomList = roomService.getRoomAvailableForService(request.getServiceId());
        if (roomList.isEmpty()) {
            throw new AppException(ErrorCode.OUT_OF_ROOM);
        } else {
            Room room = roomList.getFirst();
            bookingSession.setRoom(room);
            roomService.incrementInUse(room.getId());
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
        bookingSession.setBooking(booking);
        bookingSession.setBookingDate(request.getBookingTime().toLocalDate());
        bookingSession.setSessionDateTime(request.getBookingTime());
        bookingSessionRepository.save(bookingSession);

        return bookingMapper.toBookingResponse(booking);
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




}