package com.SWP.SkinCareService.dto.response.Room;

import com.SWP.SkinCareService.dto.response.Services.ServiceSummaryResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RoomResponse {
    int id;
    String name;
    int capacity;
    int inUse;
    List<ServiceSummaryResponse>  services;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
} 