package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Notification.NotificationRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.Notification.NotificationResponse;
import com.SWP.SkinCareService.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@SuppressWarnings("ALL")
@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    NotificationService notificationService;

    //Create notification
    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(@RequestBody NotificationRequest notificationRequest) {
        var result = notificationService.create(notificationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<NotificationResponse>builder()
                        .result(result)
                        .build()
        );
    }


    //Get notification by NOTIFICATION id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotificationById(@PathVariable int id) {
        var result = notificationService.getNotificationById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<NotificationResponse>builder().result(result).build()
        );
    }

    //Get all notification of user with status not read
    @GetMapping("/not-read")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getAllNotificationNotReadByUser() {
        var result = notificationService.getNotificationsIsNotReadByUser();
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<List<NotificationResponse>>builder()
                        .result(result)
                        .build()
        );
    }

    //Mark as read for notification
    @PutMapping("/{id}/mark-read")
    public ResponseEntity<ApiResponse<NotificationResponse>> updateNotificationStatus(@PathVariable int id) {
        var result = notificationService.updateStatus(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<NotificationResponse>builder().result(result).build()
        );
    }

    //Delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteNotfication(@PathVariable int id) {
        notificationService.deleteNotificationById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.builder().message("Deleted").build()
        );
    }


}
