package com.SWP.SkinCareService.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceRequest {

    @NotBlank(message = "Tên dịch vụ không được để trống!")
    @Size(max = 255, message = "Tên dịch vụ không được vượt quá 255 ký tự!")
    String serviceName;

    @NotNull(message = "Mã danh mục không được để trống!")
    Integer categoryId;

    String subTitle;

    @NotBlank(message = "Mô tả không được để trống!")
    String description;

    @NotNull(message = "Giá dịch vụ không được để trống!")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá dịch vụ phải lớn hơn 0!")
    BigDecimal price;


    @NotNull(message = "Thời gian thực hiện không được để trống!")
    @Min(value = 1, message = "Thời gian thực hiện ít nhất là 1 phút!")
    Integer durationMinutes;

    Integer session;

    @NotBlank(message = "Trạng thái không được để trống!")
    String status;
}
