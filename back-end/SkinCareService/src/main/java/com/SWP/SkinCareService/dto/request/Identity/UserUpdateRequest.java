package com.SWP.SkinCareService.dto.request.Identity;

import com.SWP.SkinCareService.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    @Pattern(regexp = "^[a-zA-Za-zA-ZAÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬEÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢUÚÙỦŨỤƯỨỪỬỮỰYÝỲỶỸỴaáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵĐđ ]+$",
            message = "LETTER_ONLY")
    String fullName;

    @Email(message = "EMAIL_INVALID")
    String email;

    @Pattern(regexp = "^\\d{10}$",message = "PHONE_NO_INVALID")
    String phone;

    @DobConstraint(min = 16, message ="INVALID_DOB")
    LocalDate dob;
}
