package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.BookingSession.BookingSessionRequest;
import com.SWP.SkinCareService.dto.request.BookingSession.SessionUpdateRequest;
import com.SWP.SkinCareService.dto.response.BookingSession.BookingSessionResponse;
import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.BookingSessionMapper;
import com.SWP.SkinCareService.repository.BookingRepository;
import com.SWP.SkinCareService.repository.BookingSessionRepository;
import com.SWP.SkinCareService.repository.TherapistRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingSessionService {
    BookingSessionRepository bookingSessionRepository;
    BookingRepository bookingRepository;
    TherapistRepository therapistRepository;
    UserRepository userRepository;
    BookingSessionMapper bookingSessionMapper;

    @Transactional
    public BookingSessionResponse create(BookingSessionRequest request) {
        // Validate booking exists and user has access
        Booking booking = validateBookingAccess(request.getBookingId());
        
        // Validate therapist exists
        Therapist therapist = therapistRepository.findById(request.getTherapistId())
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));

        // Create booking session
        BookingSession bookingSession = bookingSessionMapper.toBookingSession(request);
        bookingSession.setBooking(booking);
        bookingSession.setTherapist(therapist);

        bookingSessionRepository.save(bookingSession);
        return bookingSessionMapper.toResponse(bookingSession);
    }

    @Transactional
    public BookingSessionResponse update(int sessionId, SessionUpdateRequest request) {
        // Validate session exists and user has access
        BookingSession bookingSession = validateSessionAccess(sessionId);
        
        // Validate therapist exists
        Therapist therapist = therapistRepository.findById(request.getTherapistId())
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));

        // Update session
        bookingSessionMapper.update(bookingSession, request);
        bookingSession.setTherapist(therapist);

        bookingSessionRepository.save(bookingSession);
        return bookingSessionMapper.toResponse(bookingSession);
    }

    public Page<BookingSessionResponse> getAllByBooking(int bookingId, Pageable pageable) {
        validateBookingAccess(bookingId);
        return bookingSessionRepository.findAllByBookingId(bookingId, pageable)
                .map(bookingSessionMapper::toResponse);
    }

    public Page<BookingSessionResponse> getAllByTherapist(String therapistId, Pageable pageable) {
        validateTherapistAccess(therapistId);
        return bookingSessionRepository.findAllByTherapistId(therapistId, pageable)
                .map(bookingSessionMapper::toResponse);
    }

    public BookingSessionResponse getById(int sessionId) {
        return bookingSessionMapper.toResponse(validateSessionAccess(sessionId));
    }

    private Booking validateBookingAccess(int bookingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));

        if (!booking.getUser().getId().equals(userId) && 
            (booking.getStaff() == null || !booking.getStaff().getId().equals(userId))) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return booking;
    }

    private BookingSession validateSessionAccess(int sessionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        BookingSession session = bookingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_EXISTED));

        if (!session.getBooking().getUser().getId().equals(userId) && 
            (session.getTherapist() == null || !session.getTherapist().getUser().getId().equals(userId))) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return session;
    }

    private void validateTherapistAccess(String therapistId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Therapist therapist = therapistRepository.findById(therapistId)
                .orElseThrow(() -> new AppException(ErrorCode.THERAPIST_NOT_EXISTED));

        if (!therapist.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }
} 