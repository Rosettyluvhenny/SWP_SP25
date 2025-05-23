package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingSessionRepository extends JpaRepository<BookingSession, Integer>, JpaSpecificationExecutor {

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

    @Query("SELECT bs FROM BookingSession bs JOIN bs.booking b WHERE b.user.id = :userId AND bs.status IN :statuses AND bs.sessionDateTime BETWEEN :startDate AND :endDate")
    List<BookingSession> findAllBookingSessionsByUserIdAndInStatusBetweenDates(
            @Param("userId") String userId,
            @Param("statuses") List<BookingSessionStatus> statuses,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT bs FROM BookingSession bs JOIN bs.booking b WHERE b.user.id = :userId AND bs.status NOT IN :excludedStatuses AND bs.sessionDateTime BETWEEN :startDate AND :endDate")
    List<BookingSession> findAllBookingSessionsByUserIdAndExcludedStatusesBetweenDates(
            @Param("userId") String userId,
            @Param("excludedStatuses") List<BookingSessionStatus> excludedStatuses,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT bs FROM BookingSession bs JOIN bs.booking b WHERE b.service.id = :serviceId AND bs.status = :status AND bs.room.id = :roomId")
    List<BookingSession> findAllByRoomIdAndServiceIdAndStatusNotIn(
            @Param("roomId") int roomId,
            @Param("serviceId") int serviceId,
            @Param("status") BookingSessionStatus status );

    List<BookingSession> findAllByBooking(Booking booking);

    List<BookingSession> findByBookingUserPhone(String phoneNumber);

    Page<BookingSession> findAll(Specification spec, Pageable pageable);

    List<BookingSession> findByTherapist_IdAndSessionDateTimeBetweenAndStatusNotIn(String therapistId,LocalDateTime startOfDay,
                                                                                   LocalDateTime endOfDay,
                                                                                   List<BookingSessionStatus> excludeStatuses);

    List<BookingSession> findByStatusInAndSessionDateTimeBefore(List<BookingSessionStatus> waiting, LocalDateTime threshold);

    List<BookingSession> findByTherapistAndSessionDateTimeBetween(Therapist therapist, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<BookingSession> findByTherapistAndStatusIn(Therapist therapist, List<BookingSessionStatus> status);

    List<BookingSession> findAllByBookingAndCreateAtBetweenAndStatus(Booking booking,LocalDateTime from, LocalDateTime to, BookingSessionStatus status);
    Page<BookingSession> findAllByTherapistAndSessionDateTimeBetweenAndStatus(Pageable pageable, Therapist therapist, LocalDateTime from, LocalDateTime to, BookingSessionStatus status);

}
