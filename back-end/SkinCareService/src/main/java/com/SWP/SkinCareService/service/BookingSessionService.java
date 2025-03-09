package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Booking.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.Booking.SessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
import com.SWP.SkinCareService.entity.*;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.exception.MultipleParameterValidationException;
import com.SWP.SkinCareService.mapper.BookingSessionMapper;
import com.SWP.SkinCareService.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class  BookingSessionService {
    BookingSessionRepository bookingSessionRepository;
    BookingSessionMapper bookingSessionMapper;
    BookingRepository bookingRepository;
    UserRepository userRepository;
    RoomRepository roomRepository;
    TherapistRepository therapistRepository;
    SupabaseService supabaseService;
    FeedbackRepository feedbackRepository;

    public BookingSessionResponse createBookingSession(BookingSessionRequest request) {
        //Check room
        Room room = getRoomById(request.getRoomId());
        //Check booking
        Booking booking = getBookingById(request.getBookingId());
        //Check therapist
        Therapist therapist = getTherapistById(request.getTherapistId());


        BookingSession session = bookingSessionMapper.toBookingSession(request);
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
    public BookingSessionResponse updateBefore(int id, SessionUpdateRequest request, MultipartFile img) throws IOException {
        BookingSession session = checkSession(id);
        //Check room existed or not
        Room room = getRoomById(request.getRoomId());
        //Condition check room available
        //-----------------------------
        session.setRoom(room);

        //Assign staffID

        //Ordinal number of the session in the booking
        int sessionNum = 0;
        Booking booking = session.getBooking();
        List<BookingSession> list = booking.getBookingSessions();
        for (BookingSession bookingSession : list) {
            if (session.getId() == bookingSession.getId()) {
                sessionNum = list.indexOf(bookingSession)+1;
            }
        }
        //Set the image before session start
        if (img == null || img.isEmpty()) {
            throw new MultipleParameterValidationException(Collections.singletonList("img"));
        }
        String imgBefore = supabaseService.uploadImage(img,"Before_session_"+sessionNum+"_booking_"+booking.getId());
        session.setImgBefore(imgBefore);
        //Save and response
        bookingSessionRepository.save(session);
        return bookingSessionMapper.toBookingSessionResponse(session);
    }
    public BookingSessionResponse updateAfter(int id, MultipartFile img) throws IOException {
        BookingSession session = checkSession(id);
        if (session.getImgBefore() == null) {
            throw new AppException(ErrorCode.UPDATE_NOT_ALLOWED);
        }
        //Ordinal number of the session in the booking
        int sessionNum = 0;
        Booking booking = session.getBooking();
        List<BookingSession> list = booking.getBookingSessions();
        for (BookingSession bookingSession : list) {
            if (session.getId() == bookingSession.getId()) {
                sessionNum = list.indexOf(bookingSession)+1;
            }
        }
        //Set the image after session finish
        if (img == null || img.isEmpty()) {
            throw new MultipleParameterValidationException(Collections.singletonList("img"));
        }
        String imgAfter = supabaseService.uploadImage(img,"After_session"+sessionNum+"_booking"+booking.getId());
        session.setImgAfter(imgAfter);

        if (session.isFinished()) {
            session.setStatus(BookingSessionStatus.COMPLETED);
            //Check status of bookingService
            booking.setSessionRemain(booking.getSessionRemain()-1);
            if (booking.getSessionRemain() == 0) {
                booking.setStatus(BookingStatus.COMPLETED);
            }

            //Create feedback
            Feedback feedback = new Feedback();
            //Set data
            feedback.setServiceId(booking.getService().getId());
            feedback.setBookingSession(session);
            feedback.setUser(booking.getUser());
            feedback.setTherapistId(session.getTherapist().getId());
            feedback.setRated(false);
            //Save
            feedbackRepository.save(feedback);

            bookingRepository.save(booking);
        }


        //Save and response
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
