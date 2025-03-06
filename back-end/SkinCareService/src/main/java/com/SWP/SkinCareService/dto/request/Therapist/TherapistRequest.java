package com.SWP.SkinCareService.dto.request.Therapist;

import com.SWP.SkinCareService.validator.DobConstraint;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TherapistRequest {
    @Size(min=5, message = "USERNAME_INVALID")
    String username;
    @Size(min=8, message = "PASSWORD_INVALID")
    String password;
    @NotBlank
    String fullName;

    @NotBlank
    @Email(message = "EMAIL_INVALID")
    String email;

    @Pattern(regexp = "^\\d{10}$",message = "PHONE_NO_INVALID")
    String phone;

    @DobConstraint(min = 22, message ="INVALID_DOB")
    LocalDate dob;
    @NotNull
    int  experienceYears;

    String bio;

    List<Integer> serviceId = new ArrayList<>();
}
