package com.SWP.SkinCareService.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomRequest {

    @NotBlank(message = "Tên phòng không được để trống!")
    @Size(max = 255, message = "Tên phòng không được vượt quá 255 ký tự!")
    String roomName;

    @NotNull(message = "Sức chứa không được để trống!")
    @Min(value = 1, message = "Sức chứa ít nhất là 1!")
    Integer capacity;

    @NotNull(message = "Số lượng đang sử dụng không được để trống!")
    @Min(value = 0, message = "Số lượng đang sử dụng không thể âm!")
    Integer inUse;
}
