package com.SWP.SkinCareService.dto.request.Booking;

import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionUpdateRequest {
    String therapistId;
}
