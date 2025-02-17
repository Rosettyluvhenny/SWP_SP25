package com.SWP.SkinCareService.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "services") // Đổi tên bảng nếu cần
@Getter
@Setter
public class ServiceList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    private String serviceName;
    private int categoryId;
    private String subTitle;
    private String description;
    private int price;
    private int durationMinutes;
    private int sesions;
    private String status;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
