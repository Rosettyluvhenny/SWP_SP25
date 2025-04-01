package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Identity.UserUpdateRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistRequest;
import com.SWP.SkinCareService.dto.request.Therapist.TherapistUpdateRequest;
import com.SWP.SkinCareService.dto.response.Therapist.TherapistResponse;
import com.SWP.SkinCareService.dto.response.Therapist.TherapistSummaryResponse;
import com.SWP.SkinCareService.entity.Therapist;
import com.SWP.SkinCareService.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TherapistMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "experienceYears", source = "experienceYears")
    @Mapping(target = "bio", source = "bio")
    Therapist toTherapist(TherapistRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "username", source = "username")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "dob", source = "dob")
    @Mapping(target = "active", constant = "true")
    User toUser(TherapistRequest request);

    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "dob", source = "dob")
    UserUpdateRequest toUserUpdateRequest(TherapistUpdateRequest request);

    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "fullName", source = "user.fullName")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "dob", source = "user.dob")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "roles", source = "user.roles")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "active", source = "user.active")
    TherapistResponse toResponse(Therapist therapist);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "experienceYears", source = "experienceYears")
    @Mapping(target = "bio", source = "bio")
    void update(@MappingTarget Therapist therapist, TherapistUpdateRequest request);

    @Mapping(target = "fullName", source = "user.fullName")
    TherapistSummaryResponse toTherapistSummary(Therapist therapist);
}
