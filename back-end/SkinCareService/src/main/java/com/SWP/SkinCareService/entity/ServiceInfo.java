package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceInfo {
    @Id
    @ManyToOne()
    @JsonBackReference
    private Services services;

    String description;
    String url;
    String tech;
    String commitment;
    String commitmentUrl;


}
