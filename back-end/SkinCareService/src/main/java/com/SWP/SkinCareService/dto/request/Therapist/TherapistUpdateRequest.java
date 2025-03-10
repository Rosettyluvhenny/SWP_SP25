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
public class TherapistUpdateRequest {

    @Pattern(regexp = "^\\d{10}$",message = "PHONE_NO_INVALID")
    String phone;

    @Min(value = 0,message = "MIN")
    int  experienceYears;

    String bio;

    List<Integer> serviceIds = new ArrayList<>();
}
