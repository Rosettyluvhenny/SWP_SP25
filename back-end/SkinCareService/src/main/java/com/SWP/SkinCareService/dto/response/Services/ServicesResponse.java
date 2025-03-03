package com.SWP.SkinCareService.dto.response.Services;

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

//    ServiceCategory serviceCategory;

//    String subTitle;

    BigDecimal price;

    int duration;

//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
//    LocalDateTime createdAt;

//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
//    LocalDateTime updatedAt;

    int session;

//    boolean active;

//    ServiceInfo serviceInfo;
    String img;

    String description;
}
