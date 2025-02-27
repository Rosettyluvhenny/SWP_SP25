package com.SWP.SkinCareService.dto.request.Services;

import com.SWP.SkinCareService.entity.Services;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceInfoRequest {

    @NotNull(message = "NOT_EMPTY")
    int serviceId;


    @NotBlank(message = "NOT_EMPTY")
    String description;

//    @NotBlank(message = "NOT_EMPTY")
//    MultipartFile desImg;

    @NotBlank(message = "NOT_EMPTY")
    String tech;
//
//    @NotNull(message = "NOT_EMPTY")
//    MultipartFile techImg;

    @NotNull(message = "NOT_EMPTY")
    String mechanism;

//    @NotNull(message = "NOT_EMPTY")
//    MultipartFile mechaImg;
//
//    @NotBlank(message= "NOT_EMPTY")
//    MultipartFile serviceImg;
}
