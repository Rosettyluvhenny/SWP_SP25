package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentID")
    Integer paymentId;

    @Column(name = "PaymentName", nullable = false, unique = true)
    String paymentName;

    String description;

    @OneToMany(mappedBy = "payment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    List<Booking> bookings;


}
