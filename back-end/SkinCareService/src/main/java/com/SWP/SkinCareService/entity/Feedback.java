package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table
@Getter
@Setter
@ToString(exclude = {"user","bookingSession", "therapist", "service"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@EntityListeners(AuditingEntityListener.class)
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String feedbackText;

    @Column(nullable = false)
    private Integer rating = 0;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;


    // Many-to-One - User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    // Many-to-One - BookingSession (One feedback belongs to one session)
    @OneToOne
    @JoinColumn(name = "bookingSessionId", unique = true, nullable = false)
    private BookingSession bookingSession;

    // Many-to-One - Therapist (One feedback belongs to one therapist)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapistId", nullable = false)
    private Therapist therapist;

    // Many-to-One - Service (One feedback belongs to one service)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "serviceId", nullable = false)
    private Services service;

    @Column(nullable = false)
    private boolean rated = false;

}
