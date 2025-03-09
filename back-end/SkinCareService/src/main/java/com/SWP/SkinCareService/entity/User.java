package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;
import java.util.List;
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
    String id;

    @Column(name = "user_name")
    String username;

    @Column(name = "full_name")
    @Pattern(regexp = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơĂẸẻẽềếểưỲÝỶỸỳýỷỹƯỨỪễ ]+$",
            message = "LETTER_ONLY")
    String fullName;

    @Email
    @Column(name = "email")
     String email;

    @Column(name = "password")
    String password;

    @Column(name = "third_party_provider")
    String thirdPartyProvider;

    @Column(name = "third_party_id")
    String thirdPartyId;

    @Column(name = "phone_number", length = 10)
    String phone;

    @Column(name = "is_active")
    boolean active = true;


    LocalDate dob;
    @ManyToMany()
    Set<Role> roles;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonBackReference
    Therapist therapist;

    @OneToMany(mappedBy = "user", cascade = CascadeType.PERSIST)
    @JsonBackReference
    Set<Booking> booking;

    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    @JsonManagedReference
    Set<BookingSession> bookingSessionStaff;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    Set<Feedback> feedback;
    @ManyToOne
    @JoinColumn(name = "skin_type", referencedColumnName = "id")
    @JsonBackReference
    QuizResult quizResult;
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
