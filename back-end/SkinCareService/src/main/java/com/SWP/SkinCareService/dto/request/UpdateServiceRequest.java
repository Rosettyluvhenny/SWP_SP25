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
public class UpdateServiceRequest {

    @Size(max = 255, message = "Tên dịch vụ không được vượt quá 255 ký tự!")
    String serviceName;

    Integer categoryId;

    String subTitle;

    String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Giá dịch vụ phải lớn hơn 0!")
    @Digits(integer = 10, fraction = 2, message = "Giá dịch vụ không hợp lệ, chỉ được tối đa 2 chữ số thập phân!")
    BigDecimal price;

    @Min(value = 1, message = "Thời gian thực hiện ít nhất là 1 phút!")
    Integer durationMinutes;

    Integer session;

    String status;
}
