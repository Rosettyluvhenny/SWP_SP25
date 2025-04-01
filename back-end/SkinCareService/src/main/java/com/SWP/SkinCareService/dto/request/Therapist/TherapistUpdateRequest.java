package com.SWP.SkinCareService.dto.request.Therapist;

import com.SWP.SkinCareService.validator.DobConstraint;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TherapistUpdateRequest {

    @Min(value = 0,message = "MIN")
    @Max(value = 30, message ="MAX")
    Integer  experienceYears;

    String bio;

    List<Integer> serviceIds = new ArrayList<>();
    @Pattern(regexp = "^[a-zA-ZAÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬEÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢUÚÙỦŨỤƯỨỪỬỮỰYÝỲỶỸỴaáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵ ]+$",
            message = "LETTER_ONLY")
    String fullName;

    @Email(message = "EMAIL_INVALID")
    String email;

    @Pattern(regexp = "^\\d{10}$",message = "PHONE_NO_INVALID")
    String phone;

    @DobConstraint(min = 16, message ="INVALID_DOB")
    LocalDate dob;
}
