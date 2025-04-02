package com.SWP.SkinCareService.dto.response.Notification;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    int id;
    String text;
    LocalDateTime createdAt;
    String url;
    boolean isRead;
}
