package com.SWP.SkinCareService.dto.response;

import com.SWP.SkinCareService.entity.QuizResult;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.entity.ServiceCategory;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceResponse {
    Long serviceId;
    String serviceName;
    ServiceCategory serviceCategory;
    String subTitle;
    String description;
    BigDecimal price;
    Integer durationMinutes;
    Integer session;
    String status;
    List<Room> rooms;
    List<QuizResult> quizResult;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
