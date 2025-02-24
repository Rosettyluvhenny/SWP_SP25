package com.SWP.SkinCareService.dto.request.service;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCategoryRequest {
    private String categoryName;
    private String description;
}
