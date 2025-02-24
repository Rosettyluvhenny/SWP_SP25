package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServiceID")
    Long serviceId;


    @Column(name = "ServiceName", nullable = false)
    String serviceName;



    @ManyToOne()
    @JoinColumn(name = "serviceCategoryId")
    @JsonBackReference
    private ServiceCategory serviceCategory;

    @Column(name = "SubTitle", columnDefinition = "TEXT")
    String subTitle;


    @Column(name = "Description", columnDefinition = "LONGTEXT", nullable = false)
    String description;


    @Column(name = "Price", nullable = false, precision = 10, scale = 2)
    BigDecimal price;


    @Column(name = "DurationMinutes", nullable = false)
    Integer durationMinutes;

    @Column(name = "Session")
    Integer session;

    //@Column(name = "Img")
    //String img;


    @Column(name = "Status")
    String status;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UpdatedAt")
    LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
