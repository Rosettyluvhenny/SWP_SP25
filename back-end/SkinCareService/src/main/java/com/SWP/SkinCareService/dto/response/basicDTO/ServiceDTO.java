package com.SWP.SkinCareService.dto.response.basicDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceDTO {
    int id;
    String name;
    BigDecimal price;
    int duration;
    int session;
    String img;
    String description;
}