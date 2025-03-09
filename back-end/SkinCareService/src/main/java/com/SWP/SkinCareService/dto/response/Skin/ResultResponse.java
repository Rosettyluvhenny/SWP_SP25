package com.SWP.SkinCareService.dto.response.Skin;

import com.SWP.SkinCareService.dto.response.basicDTO.ServiceDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultResponse {
    int id;
    String resultText;
    List<ServiceDTO> services;
}
