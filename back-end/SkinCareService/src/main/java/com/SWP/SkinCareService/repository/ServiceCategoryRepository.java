package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Integer > {
    boolean existsByName(String name);
}
