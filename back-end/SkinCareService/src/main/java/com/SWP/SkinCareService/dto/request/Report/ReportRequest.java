package com.SWP.SkinCareService.dto.request.Report;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    int id;
    LocalDate date;
    BigDecimal revenue;
    int totalBooking;
}
