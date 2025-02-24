package com.SWP.SkinCareService.dto.response.service;

import com.SWP.SkinCareService.entity.Quiz;
import com.SWP.SkinCareService.entity.ServiceList;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCategoryResponse {
    private int id;
    private String categoryName;
    private String description;
    private List<Quiz> quiz;
    private List<ServiceList> serviceList;
}
