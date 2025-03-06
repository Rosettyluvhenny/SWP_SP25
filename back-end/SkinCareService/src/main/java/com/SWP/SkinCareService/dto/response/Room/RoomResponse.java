package com.SWP.SkinCareService.dto.response.Room;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

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
    List<Integer> serviceIds;
    List<String> serviceNames;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
} 