package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalTime;
import java.util.Date;

@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    //Many to One - Booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookingId")
    @JsonBackReference
    private Booking booking;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date bookingDate;

    @Column(columnDefinition = "TIME")
    LocalTime bookingTime;

    String status;
    String note;
    String imgBefore;
    String imgAfter;
    //Many to One - Room
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roomId")
    @JsonBackReference
    Room room;

    //Therapist id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapistId")
    @JsonBackReference
    Therapist therapist;


    //Many to One - User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "isCancelBy")
    @JsonBackReference
    private User cancelBy;
}
