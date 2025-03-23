package com.SWP.SkinCareService.dto.request.Services;

import com.SWP.SkinCareService.enums.ServiceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "NOT_EMPTY")
    ServiceType type;
}
