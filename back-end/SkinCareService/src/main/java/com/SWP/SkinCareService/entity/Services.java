package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    String subTitle;

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

    boolean active = false;

    @OneToOne(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    ServiceInfo serviceInfo;
}
