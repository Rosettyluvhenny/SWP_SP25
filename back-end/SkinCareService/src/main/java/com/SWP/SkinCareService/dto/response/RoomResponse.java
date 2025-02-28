package com.SWP.SkinCareService.dto.response;

import com.SWP.SkinCareService.entity.Services;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {
    Long roomId;
    String roomName;
    Integer capacity;
    Integer inUse;
    List<Services> services;
}
