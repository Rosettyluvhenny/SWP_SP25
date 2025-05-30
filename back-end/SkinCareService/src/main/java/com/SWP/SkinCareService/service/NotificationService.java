package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Notification.NotificationRequest;
import com.SWP.SkinCareService.dto.response.Notification.NotificationResponse;
import com.SWP.SkinCareService.entity.BookingSession;
import com.SWP.SkinCareService.entity.Notification;
import com.SWP.SkinCareService.entity.User;
import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.NotificationMapper;
import com.SWP.SkinCareService.repository.BookingSessionRepository;
import com.SWP.SkinCareService.repository.NotificationRepository;
import com.SWP.SkinCareService.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    NotificationRepository notificationRepository;
    NotificationMapper notificationMapper;
    UserRepository userRepository;
    BookingSessionRepository bookingSessionRepository;

    @Transactional
    public NotificationResponse create(NotificationRequest request) {
        Notification notification = notificationMapper.toNotification(request);
        User user = getUserById(request.getUserId());
        notification.setUser(user);
        notificationRepository.save(notification);
        return notificationMapper.toResponse(notification);
    }

    @Transactional


    public NotificationResponse getNotificationById(int id) {
        return notificationMapper.toResponse(notificationRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND)));
    }


    public List<NotificationResponse> getAllNotificationByUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = getUserByUsername(username);
        return notificationRepository.findAllByUser(user).stream().map(notificationMapper::toResponse).toList();
    }

    @Transactional
    public List<NotificationResponse> getNotificationsIsNotReadByUser() {

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = getUserByUsername(username);

        LocalDateTime timeMakeRequest = LocalDateTime.now();
        LocalDateTime timeToCheckSessionStart = timeMakeRequest.plusHours(2);
        List<BookingSessionStatus> statuses = List.of(BookingSessionStatus.WAITING,BookingSessionStatus.PENDING);

        List<BookingSession> sessionList = bookingSessionRepository.findAllBookingSessionsByUserIdAndInStatusBetweenDates(user.getId(),statuses,timeMakeRequest, timeToCheckSessionStart);

        if (sessionList != null && !sessionList.isEmpty()) {
            for (BookingSession bookingSession : sessionList) {
                if (!bookingSession.isReminder()) {
                    NotificationRequest request = NotificationRequest.builder()
                            .text("Buổi dịch vụ "+bookingSession.getBooking().getService().getName()+" của bạn sẽ diễn ra vào lúc "+ bookingSession.getSessionDateTime().toLocalTime())
                            .userId(bookingSession.getBooking().getUser().getId())
                            .isRead(false)
                            .url("http://localhost:3000/sessionDetail/"+bookingSession.getId())
                            .build();
                    create(request);
                    bookingSession.setReminder(true);
                    bookingSessionRepository.save(bookingSession);
                }
            }
        }
        return notificationRepository.findAllByUserAndIsReadOrderByCreatedAtDesc(user, false).stream().map(notificationMapper::toResponse).toList();
    }

    @Transactional
    public NotificationResponse updateStatus(int id) {
        Notification notification = getNotification(id);
        notification.setRead(true);
        notificationRepository.save(notification);
        return notificationMapper.toResponse(notification);
    }

    @Transactional
    public void deleteNotificationById(int id) {
        Notification notification = getNotification(id);
        notificationRepository.delete(notification);

    }

    private Notification getNotification(int id) {
        return notificationRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
    }

    private User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private BookingSession getBookingSessionById(int id) {
        return bookingSessionRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.SESSION_NOT_EXISTED));
    }
}
