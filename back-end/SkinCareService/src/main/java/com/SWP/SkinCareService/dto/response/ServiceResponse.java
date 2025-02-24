package com.SWP.SkinCareService.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceResponse {
    Long serviceId;
    String serviceName;
    Integer categoryId;
    String subTitle;
    String description;
    BigDecimal price;
    Integer durationMinutes;
    Integer session;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
