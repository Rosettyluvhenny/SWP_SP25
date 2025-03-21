package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingSessionRepository extends JpaRepository<BookingSession, Integer> {

    List<BookingSession> findByTherapistIdAndSessionDateTimeBetweenAndStatusNotIn(
            String therapistId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            List<BookingSessionStatus> status
    );


    List<BookingSession> findAllBySessionDateTimeBetweenAndStatusNotIn(LocalDateTime startTime, LocalDateTime endTime, List<BookingSessionStatus> status);

    List<BookingSession> findBySessionDateTimeBetweenAndStatusNotIn(LocalDateTime startOfDay,
                                                                    LocalDateTime endOfDay,
                                                                    List<BookingSessionStatus> excludeStatuses);

    List<BookingSession> findAllBySessionDateTimeBetweenAndStatusIn(LocalDateTime startTime, LocalDateTime endTime, List<BookingSessionStatus> status);

    @Query("SELECT bs FROM BookingSession bs JOIN bs.booking b WHERE b.user.id = :userId AND bs.status = :status AND bs.sessionDateTime BETWEEN :startDate AND :endDate")
    List<BookingSession> findAllBookingSessionsByUserIdAndStatusBetweenDates(
            @Param("userId") String userId,
            @Param("status") BookingSessionStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    List<BookingSession> findAllByBooking(Booking booking);

    List<BookingSession> findByBookingUserPhone(String phoneNumber);

    Page<BookingSession> findAll(Specification spec, Pageable pageable);
}
