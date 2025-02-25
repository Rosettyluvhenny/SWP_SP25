package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Therapist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TherapistRepository extends JpaRepository<Therapist, String> {
    Therapist findByUserId(String userId);
}
