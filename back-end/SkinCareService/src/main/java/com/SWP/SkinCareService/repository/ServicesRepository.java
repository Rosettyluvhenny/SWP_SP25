package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.Services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicesRepository extends JpaRepository<Services, Integer> {
    boolean existsByName(String name);
    Page<Services> findAllByActiveTrue(Pageable pageable);
}
