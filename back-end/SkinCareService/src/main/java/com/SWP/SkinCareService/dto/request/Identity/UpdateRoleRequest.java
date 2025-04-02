package com.SWP.SkinCareService.dto.request.Identity;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;
@Data
public class UpdateRoleRequest {
    @NotNull(message="NOT_EMPTY")
    String description;
}
