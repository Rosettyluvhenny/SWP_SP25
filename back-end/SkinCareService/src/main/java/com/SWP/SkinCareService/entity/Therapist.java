package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.service.spi.ServiceException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "therapist")
@Getter
@Setter
@ToString(exclude = {"user", "bookingSessions", "services"})
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Therapist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    User user;

    int experienceYears;

    float rating = 0.0f;

    String bio;

    @ManyToMany
    @JoinTable(
            name = "therapist_service",
            joinColumns = @JoinColumn(name = "therapist_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    @JsonBackReference
    Set<Services> services ;

    public void addService(Services service) {
        services.add(service);
        service.getTherapists().add(this);
    }

    public void removeService(Services service) {
        services.remove(service);
        service.getTherapists().remove(this);
    }

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime updatedAt;

    @OneToMany(mappedBy = "therapist", cascade = CascadeType.PERSIST)
    @JsonManagedReference
    List<BookingSession> bookingSessions;


    String img;

    @OneToMany(mappedBy = "therapist", orphanRemoval = true)
    @JsonManagedReference
    Set<Feedback> feedbacks;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Therapist therapist = (Therapist) o;
        return id != null && id.equals(therapist.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    public void removeAllService(){
        for (Services service : this.services){
            service.getTherapists().remove(this);
        }
    }
}
