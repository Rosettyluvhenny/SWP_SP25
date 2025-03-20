package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Notification.NotificationRequest;
import com.SWP.SkinCareService.dto.response.Booking.BookingSessionResponse;
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
        BookingSession bookingSession = getBookingSessionById(request.getSessionId());
        if (bookingSession.getNotification() != null) {
            return notificationMapper.toResponse(bookingSession.getNotification());
        }
        notification.setUser(user);
        notification.setBookingSession(bookingSession);
        notificationRepository.save(notification);
        return notificationMapper.toResponse(notification);
    }

    @Transactional


    public NotificationResponse getNotificationById(int id) {
        return notificationMapper.toResponse(notificationRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND)));
    }

    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll().stream().map(notificationMapper::toResponse).toList();
    }


    public List<NotificationResponse> getAllNotificationByUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = getUserByUsername(username);
        return notificationRepository.findAllByUser(user).stream().map(notificationMapper::toResponse).toList();
    }

    @Transactional
    public List<NotificationResponse> getNotificationsIsNotReadByUser(LocalDateTime timeMakeRequest, int timeBeforeToRemind) {

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = getUserByUsername(username);

        LocalDateTime timeToStart = timeMakeRequest.plusHours(timeBeforeToRemind);
        BookingSessionStatus status = BookingSessionStatus.WAITING;
        //List<BookingSession> list = bookingSessionRepository.findAllBySessionDateTimeBetweenAndStatusIn(timeMakeRequest, timeToStart, status);

        List<BookingSession> sessionList = bookingSessionRepository.findAllBookingSessionsByUserIdAndStatusBetweenDates(user.getId(),status,timeMakeRequest,timeToStart);

        if (sessionList != null && !sessionList.isEmpty()) {
            for (BookingSession bookingSession : sessionList) {
                if (bookingSession.getNotification() == null) {
                    NotificationRequest request = NotificationRequest.builder()
                            .sessionId(bookingSession.getId())
                            .text("Phiên đặt lịch của bạn sẽ diễn ra vào lúc "+ bookingSession.getSessionDateTime().toLocalTime() +" tại "+bookingSession.getRoom().getName())
                            .userId(bookingSession.getBooking().getUser().getId())
                            .isRead(false)
                            .url(""+bookingSession.getId())
                            .build();
                    create(request);
                }
            }
        }
        return notificationRepository.findAllByUserAndIsRead(user, false).stream().map(notificationMapper::toResponse).toList();
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
