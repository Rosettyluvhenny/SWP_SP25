package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Services;
import com.SWP.SkinCareService.entity.Therapist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TherapistRepository extends JpaRepository<Therapist, String> {
    boolean existsByUserId(String userId);
    Page<Therapist> findAllByServicesIdAndUserActiveTrue(int serviceId, Pageable pageable);
    List<Therapist> findAllByServicesIdAndUserActiveTrue(int serviceId);
    @Query("SELECT t FROM Therapist t WHERE t.user.active = false")
    Page<Therapist> findInactiveTherapists(Pageable pageable);
    Page<Therapist> findTherapistByUserActiveTrue(Pageable pageable);
    List<Therapist> findTherapistByUserActiveTrue();

    Optional<Therapist> findByUserId(String id);
    List<Therapist> findTherapistByServices(List<Services> services);
    List<Therapist> findTherapistByServicesAndUserActiveTrue(List<Services> services);

    boolean existsByIdAndServices_Id(String therapistId, int serviceId);
}
