package com.SWP.SkinCareService.dto.request.Services;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignTherapistRequest {
    String therapistId;
}
