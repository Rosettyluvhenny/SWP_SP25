package com.SWP.SkinCareService.dto.response.Therapist;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TherapistSummaryResponse {
    String id;
    String fullName;
    Integer experienceYears;
    Integer rating;
    String img;
}
