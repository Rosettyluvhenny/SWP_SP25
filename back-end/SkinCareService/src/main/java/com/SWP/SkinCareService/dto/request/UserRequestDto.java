package com.SWP.SkinCareService.dto.request;

import com.SWP.SkinCareService.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    String fullName;
    @NotBlank
    @Email
    String email;

    @Pattern(regexp = "^\\d{10}$",message = "PHONE_NO_INVALID")
    String phone;

    @DobConstraint(min = 16, message ="INVALID_DOB")
    LocalDate dob;
}
