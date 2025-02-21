package com.SWP.SkinCareService.dto.response;


import com.SWP.SkinCareService.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserResponse {

    String username;

    String fullName;

    LocalDate dob;

    String email;

    String phone;

    Set<Role> roles;
}
