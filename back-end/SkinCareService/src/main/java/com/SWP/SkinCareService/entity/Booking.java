package com.SWP.SkinCareService.entity;

import com.SWP.SkinCareService.enums.BookingStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    User user;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    Services service;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "payment_id")
    Payment payment;

    @Column(columnDefinition = "TEXT")
    String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    BookingStatus status  = BookingStatus.PENDING;

    @Column(name = "is_paid", length = 50)
    boolean paid = false ;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @Column(name = "session_remain")
    int sessionRemain;


    @Column(precision = 10, scale = 2)
    BigDecimal price;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name="staff_id")
    User staff;

}