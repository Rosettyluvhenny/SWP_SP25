package com.SWP.SkinCareService.entity;

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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="services")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    int id;

    @Column(nullable = false, length = 255)
    String name;

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

    int session = 1;

    boolean active = false;

    String img;

    @ManyToMany(mappedBy = "services")
    @JsonBackReference
    List<Room> rooms = new ArrayList<>();

    @ManyToMany(mappedBy = "services")
    @JsonBackReference
    List<Therapist> therapists = new ArrayList<>();


}
