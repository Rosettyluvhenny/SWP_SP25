package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name="serviceInformation")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceInfo {
    @Id
    int id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "service_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    Services service;

    @Column(columnDefinition = "TEXT", nullable = false)
    String description; // Supports rich text

    @Column(length = 512)
    String desImgUrl;

    @Column(columnDefinition = "TEXT")
    String tech; // Supports rich text

    @Column(length = 512)
    String serviceImgUrl;

    @Column(length = 512)
    String techImgUrl;

    @Column(columnDefinition = "TEXT")
    String mechanism; // Supports rich text

    @Column(length = 512)
    String mechaImgUrl;

}
