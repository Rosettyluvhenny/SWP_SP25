package com.SWP.SkinCareService.entity;

import com.SWP.SkinCareService.enums.BookingStatus;
import com.SWP.SkinCareService.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table (name = "booking")
@Getter
@Setter
@ToString(exclude = {"user", "service", "payment", "bookingSessions"})
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

    @Column(columnDefinition = "TEXT")
    String url;

    //Many To One - Payment
    @ManyToOne()
    @JoinColumn(name = "payment")
    @JsonBackReference
    private Payment payment;

    String notes;

    @CreationTimestamp
    LocalDateTime createAt;

    @UpdateTimestamp
    LocalDateTime updateAt;

    int sessionRemain;

    //One To Many - Session
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    List<BookingSession> bookingSessions;

    //Notification

    BigDecimal price;

    @ManyToOne
    @JoinColumn(name="staff_id")
    @JsonBackReference
    User staff;

}
