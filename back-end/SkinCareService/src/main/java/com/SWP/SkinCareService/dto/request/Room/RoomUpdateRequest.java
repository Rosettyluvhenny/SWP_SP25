package com.SWP.SkinCareService.dto.request.Room;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RoomUpdateRequest {
    String name;

    @Min(value = 1, message = "MIN")
    int capacity;

    List<Integer> serviceIds = new ArrayList<>();
} 