package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.BookingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingSessionRepository extends JpaRepository<BookingSession, Integer> {
    Page<BookingSession> findAllByBookingId(int bookingId, Pageable pageable);
    Page<BookingSession> findAllByTherapistId(String therapistId, Pageable pageable);
} 