package com.SWP.SkinCareService.dto.request.service;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignSkinRequest {
    @NotNull(message = "NOT_EMPTY")
    private int skinId;
}
