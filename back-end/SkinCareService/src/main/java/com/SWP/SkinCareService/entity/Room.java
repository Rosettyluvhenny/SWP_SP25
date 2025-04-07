package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "rooms")
@Data
@ToString(exclude = {"services", "bookingSessions"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(nullable = false)
    String name;

    @Column(nullable = false)
    int capacity;

    @Column(name = "in_use", nullable = false)
    int inUse = 0;

    @ManyToMany
    @JoinTable(
            name = "room_service",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    @JsonBackReference
    Set<Services> services;

    public void addService(Services service) {
        services.add(service);
        service.getRooms().add(this);
    }

    public void removeService(Services service) {
        services.remove(service);
        service.getRooms().remove(this);
    }

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
    @OneToMany(mappedBy = "room", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference
    List<BookingSession> bookingSessions;
}
