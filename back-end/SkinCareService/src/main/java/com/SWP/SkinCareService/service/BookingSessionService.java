package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.BookingSessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.BookingSessionResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BookingSessionMapper;
import com.SWP.SkinCareService.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BookingSessionService {
    BookingSessionRepository bookingSessionRepository;
    BookingSessionMapper bookingSessionMapper;
    BookingRepository bookingRepository;
    UserRepository userRepository;
    RoomRepository roomRepository;
    TherapistRepository therapistRepository;

    public BookingSessionResponse createBookingSession(BookingSessionRequest request) {
        //Check user
        User user = getUserById(request.getUserId());
        //Check room
        Room room = getRoomById(request.getRoomId());
        //Check booking
        Booking booking = getBookingById(request.getBookingId());
        //Check therapist
        Therapist therapist = getTherapistById(request.getTherapistId());


        BookingSession session = bookingSessionMapper.toBookingSession(request);
        session.setCancelBy(user);
        session.setBooking(booking);
        session.setRoom(room);
        session.setTherapist(therapist);

        bookingSessionRepository.save(session);
        return bookingSessionMapper.toBookingSessionResponse(session);
    }
    public List<BookingSessionResponse> getAllBookingSessions() {
        return bookingSessionRepository.findAll().stream().map(bookingSessionMapper::toBookingSessionResponse).toList();
    }
    public BookingSessionResponse getBookingSessionById(int id) {
        return bookingSessionMapper.toBookingSessionResponse(checkSession(id));
    }
    public BookingSessionResponse updateBookingSession(int id, BookingSessionUpdateRequest request) {
        //Check user
        User user = getUserById(request.getUserId());
        //Check room
        Room room = getRoomById(request.getRoomId());
        //Check booking
        Booking booking = getBookingById(request.getBookingId());
        //Check session
        BookingSession session = checkSession(id);
        //Check therapist
        Therapist therapist = getTherapistById(request.getTherapistId());

        bookingSessionMapper.updateBookingSession(session, request);
        
        session.setCancelBy(user);
        session.setBooking(booking);
        session.setRoom(room);
        session.setStatus(request.getStatus());
        session.setNote(request.getNote());
        session.setImgBefore(request.getImgBefore());
        session.setImgAfter(request.getImgAfter());
        session.setTherapist(therapist);

        bookingSessionRepository.save(session);
        return bookingSessionMapper.toBookingSessionResponse(session);
    }
    public void deleteBookingSession(int id) {
        BookingSession session = checkSession(id);
        bookingSessionRepository.delete(session);
    }

    BookingSession checkSession(int id) {
        return bookingSessionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SESSION_NOT_EXISTED));
    }
    User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
    Booking getBookingById(int id) {
        return bookingRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
    }
    Room getRoomById(int id) {
        return roomRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
    }
    Therapist getTherapistById(String id) {
        return therapistRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));
    }
}
