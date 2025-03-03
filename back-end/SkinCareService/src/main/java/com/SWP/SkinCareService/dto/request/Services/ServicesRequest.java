package com.SWP.SkinCareService.dto.request.Services;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServicesRequest {
    @NotBlank(message = "NOT_EMPTY")
    String name;

    @NotNull(message = "NOT_EMPTY")
    int serviceCategoryId;

    @NotBlank(message = "NOT_EMPTY")
    String description;
    @NotNull(message = "NOT_EMPTY")
    @Min(value = 0, message = "MIN")
    BigDecimal price;

    @NotNull(message = "NOT_EMPTY")
    @Min(value = 1, message = "MIN")
    int duration;

    @Min(value =1, message = "MIN")
    int session;

    @NotNull(message ="NOT_EMPTY")
    boolean active;

}
