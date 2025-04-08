package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Notification;
import com.SWP.SkinCareService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findAllByUserAndIsReadOrderByCreatedAtDesc(User user, boolean isRead);
    List<Notification> findAllByUser(User user);
}
