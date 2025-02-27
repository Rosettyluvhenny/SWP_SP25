package com.SWP.SkinCareService.dto.response.Services;

import com.SWP.SkinCareService.entity.Services;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceInfoResponse {
    int id;

    Services service;

    String description;

    String desImgUrl;

    String tech;

    String techImgUrl;

    String mechanism;

    String mechaImgUrl;

    String serviceImgUrl;
}
