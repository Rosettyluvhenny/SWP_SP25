package com.SWP.SkinCareService.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
}
