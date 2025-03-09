package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String feedbackText;
    int rating;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date updatedAt;

    //Many to one - User
    @ManyToOne()
    @JoinColumn(name = "userId", nullable = false)
    @JsonBackReference
    User user;

    //Many To One - Session
    @ManyToOne
    @JoinColumn(name = "bookingSessionId")
    @JsonBackReference
    BookingSession bookingSession;

    String therapistId;
    int serviceId;
    boolean isRated = false;

}
