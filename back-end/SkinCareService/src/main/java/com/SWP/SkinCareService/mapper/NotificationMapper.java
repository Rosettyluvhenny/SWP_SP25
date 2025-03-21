package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Notification.NotificationRequest;
import com.SWP.SkinCareService.dto.response.Notification.NotificationResponse;
import com.SWP.SkinCareService.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "user", ignore = true)
    Notification toNotification(NotificationRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    void update(@MappingTarget Notification notification, NotificationRequest request);

    @Mapping(target = "isRead", source = "read")
    NotificationResponse toResponse(Notification notification);
}
