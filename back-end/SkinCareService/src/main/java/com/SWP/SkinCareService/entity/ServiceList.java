package com.SWP.SkinCareService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "services") // Đổi tên bảng nếu cần
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceName;
    private String subTitle;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String description;
    private int price;
    private int durationMinutes;
    private int sesions;
    private String status;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @ManyToOne()
    @JoinColumn(name = "serviceCategoryId")
    @JsonBackReference
    private ServiceCategory serviceCategory;

    //Many to Many
    @OneToMany(mappedBy = "service")
    @JsonManagedReference
    private List<ServiceQuizResult> serviceQuizResults;
}
