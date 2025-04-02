package com.SWP.SkinCareService.dto.response.Services;

import com.SWP.SkinCareService.enums.ServiceType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicesResponse {
    int id;

    String name;

    BigDecimal price;

    int duration;

    int session;

    String img;

    String description;

    String categoryName;

    int categoryId;

    boolean active;

    ServiceType type;

    float rating;
}
