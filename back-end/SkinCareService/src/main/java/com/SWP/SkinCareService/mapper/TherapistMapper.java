package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.TherapistResponse;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TherapistMapper {
    Therapist toTherapist(TherapistRequest request);
    User toUser(TherapistRequest request);
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "fullName", source = "user.fullName")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "dob", source = "user.dob")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "roles", source = "user.roles")

    TherapistResponse toTheRapistResponse(Therapist therapist);

    void updateMapper(TherapistUpdateRequest request, @MappingTarget Therapist therapist);
}
