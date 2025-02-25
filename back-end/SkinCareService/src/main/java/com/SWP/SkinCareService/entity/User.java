package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

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
    private String phoneNumber;

    @Column(name = "is_active")
    private boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "skin_type", referencedColumnName = "id")
    @JsonBackReference
    private QuizResult quizResult;

    @ManyToMany
    Set<Role> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<BookingService> bookingService;
}
