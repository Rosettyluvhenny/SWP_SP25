package com.SWP.SkinCareService.dto.response.Services;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceSummaryResponse {

    int id;

    String name;
}
