package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Feedback;
import com.SWP.SkinCareService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findAllByService_Id(int id);
    List<Feedback> findAllByTherapist_Id(String id);
    List<Feedback> findAllByUser(User user);
}
