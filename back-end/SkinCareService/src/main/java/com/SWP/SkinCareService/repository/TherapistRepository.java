package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Therapist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TherapistRepository extends JpaRepository<Therapist, String> {
    boolean existsByUserId(String userId);
    Page<Therapist> findAllByServicesId(int serviceId, Pageable pageable);
}
