package com.SWP.SkinCareService.dto.request.Services;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignTherapistRequest {
    List<String> therapistId;
}
