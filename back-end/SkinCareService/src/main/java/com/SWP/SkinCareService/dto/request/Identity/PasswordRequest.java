package com.SWP.SkinCareService.dto.request.Identity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordRequest {
    @NotNull(message = "NOT_EMPTY")
    String oldPassword;
    @NotNull(message = "NOT_EMPTY")
    @Size(min=8, message = "PASSWORD_INVALID")
    String newPassword;
}
