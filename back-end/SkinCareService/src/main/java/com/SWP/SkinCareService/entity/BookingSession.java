package com.SWP.SkinCareService.entity;

import com.SWP.SkinCareService.enums.BookingStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonBackReference
    Booking booking;

    @Column(nullable = false)
    LocalDateTime sessionDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    BookingStatus status = BookingStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    String note;

    @Column(name = "img_before")
    String imgBefore;

    @Column(name = "img_after")
    String imgAfter;

    @ManyToOne
    @JoinColumn(name = "therapist_id")
    @JsonBackReference
    Therapist therapist;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
} 