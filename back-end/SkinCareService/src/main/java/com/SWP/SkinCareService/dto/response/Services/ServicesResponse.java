package com.SWP.SkinCareService.dto.response.Services;

import com.SWP.SkinCareService.entity.ServiceCategory;
import com.SWP.SkinCareService.entity.ServiceInfo;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.cglib.core.Local;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

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

    String categoryName;

    String categoryId;
//    List<TherapistSummaryResponse> therapists;
    boolean active;


    String categoryName;

    int categoryId;

}
