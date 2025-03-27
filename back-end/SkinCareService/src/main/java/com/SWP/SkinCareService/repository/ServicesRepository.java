package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.Services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ServicesRepository extends JpaRepository<Services, Integer>, JpaSpecificationExecutor {
    boolean existsByName(String name);
    Page<Services> findAllByActiveTrue(Specification spec, Pageable pageable);
    int countByActiveTrue();
}
