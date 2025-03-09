package com.SWP.SkinCareService.dto.request.Therapist;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetScheduleRequest {
    LocalDateTime time;
}
