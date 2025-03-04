package com.SWP.SkinCareService.dto.response.Booking;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingResponse {

        int id;

        String userId;

        String username;

        int serviceId;

        String serviceName;

        String paymentMethod;

        String notes;

        String status;

        boolean paid;

        String createdAt;

        int sessionRemain;

        BigDecimal price;

        String staffId;

        String staffName;
 }

