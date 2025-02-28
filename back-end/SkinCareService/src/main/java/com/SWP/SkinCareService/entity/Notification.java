package com.SWP.SkinCareService.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;


import java.util.Date;

@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;
    String title;
    String description;
    boolean isRead;
    String type;
    int objectId;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date createDate;

    //Many to one - Booking service
    /*
    @ManyToOne()
    @JoinColumn
    private Booking booking;
     */
    //Many to one - Booking Session
}
