package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceListRepository extends JpaRepository<Services, Long> {
}
