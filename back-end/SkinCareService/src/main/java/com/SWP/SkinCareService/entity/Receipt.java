package com.SWP.SkinCareService.entity;


import com.SWP.SkinCareService.enums.PaymentType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    LocalDateTime date;
    BigDecimal amount;
    String serviceName;
    String customerName;

    @ManyToOne
    @JsonBackReference
    Payment payment;

    PaymentType paymentType;
    String url;

    @ManyToOne
    @JsonBackReference
    User staff;

    @ManyToOne
    @JsonBackReference
    Report report;
}
