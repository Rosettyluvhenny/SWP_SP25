package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

@Entity
@Table (name = "BookingService")
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
public class BookingService {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @ManyToOne()
    @JoinColumn(name = "userid", nullable = false)
    @JsonBackReference
    private User user;
    //Many To One - service
    String status;
    String paymentStatus;
    //Many To One - Payment
    String notes;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date createAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date updateAt;

    int sessionRemain;
    //Many To One - staff
    int price;

}
