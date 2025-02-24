package com.SWP.SkinCareService.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
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

    @NotBlank(message = "Tên dịch vụ không được để trống!")
    @Size(max = 255, message = "Tên dịch vụ không được vượt quá 255 ký tự!")
    @Column(name = "ServiceName", nullable = false)
    String serviceName;

    @NotNull(message = "Mã danh mục không được để trống!")
    @Column(name = "CategoryId", nullable = false)
    Integer categoryId;

    @Column(name = "SubTitle", columnDefinition = "TEXT")
    String subTitle;

    @NotBlank(message = "Mô tả không được để trống!")
    @Column(name = "Description", columnDefinition = "TEXT", nullable = false)
    String description;

    @NotNull(message = "Giá dịch vụ không được để trống!")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá dịch vụ phải lớn hơn 0!")
    @Digits(integer = 10, fraction = 2, message = "Giá dịch vụ không hợp lệ, chỉ được tối đa 2 chữ số thập phân!")
    @Column(name = "Price", nullable = false, precision = 10, scale = 2)
    BigDecimal price;

    @NotNull(message = "Thời gian thực hiện không được để trống!")
    @Min(value = 1, message = "Thời gian thực hiện ít nhất là 1 phút!")
    @Column(name = "DurationMinutes", nullable = false)
    Integer durationMinutes;

    @Column(name = "Session")
    Integer session;

    //@Column(name = "Img")
    //String img;

    @NotBlank(message = "Trạng thái không được để trống!")
    @Column(name = "Status")
    String status;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UpdatedAt")
    LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
