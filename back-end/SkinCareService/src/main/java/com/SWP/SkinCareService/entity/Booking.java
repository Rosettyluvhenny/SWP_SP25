package com.SWP.SkinCareService.entity;

import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table (name = "booking")
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    //Many to One - User
    @ManyToOne()
    @JoinColumn(name = "userid", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private User user;

    //Many To One - service
    @ManyToOne()
    @JoinColumn(name = "serviceId", nullable = false)
    @JsonBackReference
    private Services service;

    @Enumerated(EnumType.STRING)
    BookingStatus status = BookingStatus.PENDING;
    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus = PaymentStatus.PENDING;

    //Many To One - Payment
    @ManyToOne()
    @JoinColumn(name = "payment")
    @JsonBackReference
    private Payment payment;

    String notes;

    @CreationTimestamp
    //@Temporal(TemporalType.TIMESTAMP)
    LocalDateTime createAt;

    @UpdateTimestamp
    //@Temporal(TemporalType.TIMESTAMP)
    LocalDateTime updateAt;

    int sessionRemain;

    //Many To One - staff
    @ManyToOne()
    @JoinColumn(name = "staffid", referencedColumnName = "id")
    @JsonBackReference
    private User staff;

    //One To Many - Session
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    List<BookingSession> bookingSessions;

    BigDecimal price;

}
