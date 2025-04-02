package com.SWP.SkinCareService.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {


    String password;
    String lastName;
    String firstName;
    LocalDate dob;
    String email;
    List<String> roles;
}
