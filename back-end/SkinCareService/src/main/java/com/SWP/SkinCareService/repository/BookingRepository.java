package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer>, JpaSpecificationExecutor {
    Page<Booking> findAll(Specification spec, Pageable pageable);
    List<Booking> findAllByUserId(String userId);

}
