package com.SWP.SkinCareService.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateRoomRequest {

    @Size(max = 50, message = "Tên phòng không được vượt quá 50 ký tự!")
    String roomName;

    @Min(value = 1, message = "Sức chứa phải lớn hơn hoặc bằng 1!")
    Integer capacity;

    @Min(value = 0, message = "Giá trị phải từ 0 trở lên!")
    Integer inUse;
}
