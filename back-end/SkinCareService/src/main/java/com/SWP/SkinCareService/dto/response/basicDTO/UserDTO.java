package com.SWP.SkinCareService.dto.response.basicDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserDTO {
    String id;
    String username;
    String fullName;
    String email;
    String phone;
}
