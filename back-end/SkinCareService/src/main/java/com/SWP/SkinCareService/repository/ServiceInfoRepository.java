package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.ServiceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceInfoRepository extends JpaRepository<ServiceInfo, Integer> {
}
