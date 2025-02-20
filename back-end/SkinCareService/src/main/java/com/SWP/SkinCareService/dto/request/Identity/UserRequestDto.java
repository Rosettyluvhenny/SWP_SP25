package com.SWP.SkinCareService.dto.request.Identity;

import com.SWP.SkinCareService.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequestDto {

    @Size(min=5, message = "USERNAME_INVALID")
    String username;
    @Size(min=8, message = "PASSWORD_INVALID")
    String password;
    @NotBlank
    String lastName;
    @NotBlank
    String firstName;
    @NotBlank
    @Email
    String email;
    @DobConstraint(min = 16, message ="INVALID_DOB")
    LocalDate dob;
}
