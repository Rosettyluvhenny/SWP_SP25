package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Booking;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer>, JpaSpecificationExecutor {
    Page<Booking> findAll(Specification spec, Pageable pageable);
    List<Booking> findAllByUserId(String userId);
    List<Booking> findAllByCreateAtBetweenAndStatusIn(LocalDateTime from, LocalDateTime to, List<BookingStatus> status);

    List<Booking> findAllByUserAndCreateAtBetweenAndStatusIn(User user, LocalDateTime from, LocalDateTime to, List<BookingStatus> status);

    List<Booking> findByStatusInAndBookingSessions_SessionDateTimeBefore(List<BookingStatus> status, LocalDateTime threshold);
}
