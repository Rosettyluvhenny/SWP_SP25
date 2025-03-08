package com.SWP.SkinCareService.dto.request.Services;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCategoryRequest {
    @NotBlank(message = "NOT_EMPTY")
    String name;

    @NotBlank(message = "NOT_EMPTY")
    String description;
}
