package com.SWP.SkinCareService.dto.response;

import com.SWP.SkinCareService.entity.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TherapistResponse {
    String id;
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

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime updatedAt;

    List<String> serviceNames;

    List<Integer> serviceIds;

}
