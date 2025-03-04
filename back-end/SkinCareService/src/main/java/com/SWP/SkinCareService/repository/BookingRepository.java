package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Page<Booking> findAllByUserId(String userId, Pageable pageable);
    Page<Booking> findAllByStaffId(String staffId, Pageable pageable);
}
