package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name="user")
@Getter
@Setter
@ToString(exclude = {"therapist", "quizResult", "booking", "bookingServicesStaff", "bookingSessions"})
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "user_name")
    private String username;

    @Column(name = "full_name")
    private String fullName;

    @Email
    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "third_party_provider")
    private String thirdPartyProvider;

    @Column(name = "third_party_id")
    private String thirdPartyId;

    @Column(name = "phone_number", length = 10)
    private String phone;

    @Column(name = "is_active")
    private boolean active = true;
    //
    LocalDate dob;
    @ManyToMany
    Set<Role> roles;
    //
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    Therapist therapist;
    //
    @ManyToOne
    @JoinColumn(name = "skin_type", referencedColumnName = "id")
    @JsonBackReference
    QuizResult quizResult;
    //
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    Set<Booking> booking;
    //
    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    @JsonManagedReference
    Set<BookingSession> bookingSessionStaff;
    //
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    Set<Feedback> feedback;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
