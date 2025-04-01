package com.SWP.SkinCareService.dto.response.Therapist;

import com.SWP.SkinCareService.dto.response.Services.ServiceSummaryResponse;
import com.SWP.SkinCareService.entity.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TherapistResponse {
    String id;
    String userId;
    String username;
    String fullName;
    String email;
    Integer experienceYears;
    String bio;
    LocalDate dob;
    String phone;
    Set<Role> roles;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt;
    Integer rating;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime updatedAt;

    String img;
    boolean active;
    List<ServiceSummaryResponse> services;

}
