package com.SWP.SkinCareService.entity;

import com.SWP.SkinCareService.enums.BookingSessionStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Entity
@Table
@Getter
@Setter
@ToString(exclude = {"booking", "room", "therapist", "cancelBy"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(columnDefinition = "TEXT")
    String description;
    //Many to One - Booking
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "bookingId")
    @JsonBackReference
    private Booking booking;

    //@CreationTimestamp
    //@Temporal(TemporalType.TIMESTAMP)
    LocalDate bookingDate;

    @Column(columnDefinition = "DATETIME")
    LocalDateTime sessionDateTime;

    @Enumerated(EnumType.STRING)
    BookingSessionStatus status = BookingSessionStatus.PENDING;
    String note;
    String imgBefore;
    String imgAfter;
    //Many to One - Room
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roomId")
    @JsonBackReference
    Room room;

    //Many To One - Therapist
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapistId")
    @JsonBackReference
    Therapist therapist;


    //Many to One - staff
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staffid")
    @JsonBackReference
    private User staff;

    //One To One - Feedback
    @OneToOne(mappedBy = "bookingSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    Feedback feedbacks;

    boolean rated = false;


    public boolean isFinished() {
        return Stream.of(booking, note, imgBefore, imgAfter, room, therapist, staff).allMatch(Objects::nonNull);
    }

    //Notification

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingSession that = (BookingSession) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return id;
    }

    @Column(columnDefinition = "DATETIME")
    LocalDateTime feedBackTime;
}
