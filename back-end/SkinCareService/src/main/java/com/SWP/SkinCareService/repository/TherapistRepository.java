package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.Therapist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TherapistRepository extends JpaRepository<Therapist, String> {
    Therapist findByUserId(String userId);
    Page<Therapist> findAll(Pageable pageable);
}
