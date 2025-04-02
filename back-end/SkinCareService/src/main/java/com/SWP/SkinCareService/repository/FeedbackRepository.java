package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Feedback;
import com.SWP.SkinCareService.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer>, JpaSpecificationExecutor {
    List<Feedback> findAllByUser(User user);

    List<Feedback> findAllByService_Id(int serviceId);
    List<Feedback> findAllByTherapist_Id(String therapistId);

    Page<Feedback> findAll(Specification spec, Pageable pageable);
}
