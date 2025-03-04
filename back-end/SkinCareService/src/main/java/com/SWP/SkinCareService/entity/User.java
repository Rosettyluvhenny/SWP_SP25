package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;
import java.util.List;
@Entity
@Table(name="user")
@Data
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
    boolean isActive = true;


    LocalDate dob;
    @ManyToMany
    Set<Role> roles;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    Therapist therapist;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    List<Booking> bookings;
}
