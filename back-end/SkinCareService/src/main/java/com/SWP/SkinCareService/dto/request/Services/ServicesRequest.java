package com.SWP.SkinCareService.dto.request.Services;

import com.SWP.SkinCareService.enums.ServiceType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Schema(description = "Service information for creation")
public class ServicesRequest {
    @Schema(
        description = "Name of the service",
        example = "Deep Cleansing Facial",
        defaultValue = "Basic Facial Treatment"
    )
    @NotBlank(message = "NOT_EMPTY")
    @Size(max = 255, message = "Service name must not exceed 255 characters")
    String name;

    @Schema(
        description = "Service category ID",
        example = "1",
        defaultValue = "1"
    )
    @NotNull(message = "NOT_EMPTY")
    @Min(value = 1, message = "MIN")
    Integer serviceCategoryId;

    @Schema(
        description = "Description of the service",
        example = "A deep cleansing facial that removes impurities and rejuvenates your skin",
        defaultValue = "Basic facial treatment for all skin types"
    )
    @NotBlank(message = "NOT_EMPTY")
    String description;

    @Schema(
        description = "Price of the service in dollars",
        example = "99.99",
        defaultValue = "50.00"
    )
    @NotNull(message = "NOT_EMPTY")
    @Min(value = 0, message = "MIN")
    BigDecimal price;

    @Schema(
        description = "Duration of the service in minutes",
        example = "60",
        defaultValue = "30"
    )
    @NotNull(message = "NOT_EMPTY")
    @Min(value = 1, message = "MIN")
    Integer duration;

    @Schema(
        description = "Number of sessions",
        example = "1",
        defaultValue = "1"
    )
    @NotNull(message = "NOT_EMPTY")
    @Min(value = 1, message = "MIN")
    Integer session;

    @Schema(
        description = "Whether the service is active",
        example = "true",
        defaultValue = "true"
    )
    @NotNull(message = "NOT_EMPTY")
    @Builder.Default
    Boolean active = true;


}
