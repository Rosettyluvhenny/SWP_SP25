package com.SWP.SkinCareService.dto.response.Therapist;

import com.SWP.SkinCareService.entity.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TherapistSummaryResponse {
    String id;
    String fullName;
    Integer experienceYears;
//    add rating field
    String img;
}
