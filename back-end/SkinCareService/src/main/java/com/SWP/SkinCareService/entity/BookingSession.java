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
    //Many to One - Booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookingId")
    @JsonBackReference
    private Booking booking;

    @CreationTimestamp
    //@Temporal(TemporalType.TIMESTAMP)
    LocalDate bookingDate;

    @Column(columnDefinition = "DATETIME")
    LocalDateTime bookingTime;

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

    //One To Many - Feedback
    @OneToMany(mappedBy = "bookingSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<Feedback> feedbackList;

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
}
