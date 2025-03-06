package com.SWP.SkinCareService.dto.response.Services;

import com.SWP.SkinCareService.dto.response.TherapistResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
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

    List<String> therapistIds;

    List<String> therapistNames;

    List<String> imgUrl;
}
