package com.SWP.SkinCareService.dto.request.Room;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomRequest {
    @NotBlank(message = "Room name cannot be empty")
    String roomName;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    int capacity;
    
    @Min(value = 0, message = "InUse must be at least 0")
    int inUse;
} 