package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
