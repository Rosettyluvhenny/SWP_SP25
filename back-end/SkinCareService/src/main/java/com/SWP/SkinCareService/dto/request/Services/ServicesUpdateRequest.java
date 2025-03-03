package com.SWP.SkinCareService.dto.request.Services;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ServicesUpdateRequest {
    String name;

    int serviceCategoryId;

    String description;

    @Min(value = 0, message = "MIN")
    BigDecimal price;

    @Min(value = 1, message = "MIN")
    int duration;

    @Min(value = 1, message = "MIN")
    int session;

    boolean active;
}
