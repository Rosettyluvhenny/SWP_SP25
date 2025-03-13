package com.SWP.SkinCareService.entity;


import com.SWP.SkinCareService.enums.ServiceType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "services")
@Getter
@Setter
@ToString(exclude = {"serviceCategory","quizResult","rooms","bookings","therapists","feedbacks"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    int id;

    @Column(nullable = false, length = 255)
    String name;

    //Many to One - Service Category
    @ManyToOne
    @JoinColumn(name = "service_category_id", nullable = false)
    @JsonManagedReference
    ServiceCategory serviceCategory;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(nullable = false, precision = 19, scale = 0)
    BigDecimal price;

    @Column(nullable = false)
    int duration;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    int session;

    boolean active = true;

    String img;

    ServiceType type;

    float rating;

    //Many to many with Quiz result
    @ManyToMany(cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinTable(
            name = "ServiceQuizResult",
            joinColumns = @JoinColumn(name = "serviceId"),
            inverseJoinColumns = @JoinColumn(name = "quizResultId")
    )
    @JsonManagedReference
    List<QuizResult> quizResults = new ArrayList<>();

    //Many to Many - Service
    @ManyToMany(mappedBy = "services")
    @JsonBackReference
    List<Room> rooms = new ArrayList<>();


    //One to many with Booking service
    @OneToMany(mappedBy = "service", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    List<Booking> bookings = new ArrayList<>();

    //Many to Many - Therapist
    @ManyToMany(mappedBy = "services", cascade = CascadeType.ALL)
    @JsonBackReference
    List<Therapist> therapists = new ArrayList<>();

    @OneToMany(mappedBy = "service", orphanRemoval = true)
    @JsonManagedReference
    Set<Feedback> feedbacks;

}
