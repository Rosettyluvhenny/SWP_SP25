package com.SWP.SkinCareService.dto.request.Notification;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    String text;
    String userId;
    boolean isRead;
    String url;
}
