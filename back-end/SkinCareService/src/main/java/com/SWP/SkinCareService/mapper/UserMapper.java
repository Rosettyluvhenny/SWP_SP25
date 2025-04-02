package com.SWP.SkinCareService.mapper;


import com.SWP.SkinCareService.dto.request.UserRequestDto;
import com.SWP.SkinCareService.dto.request.UserUpdateRequest;
import com.SWP.SkinCareService.dto.response.UserResponse;
import com.SWP.SkinCareService.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserRequestDto request);
    UserResponse toUserResponse(User user);
    @Mapping(target ="roles", ignore = true)
    User updateUser(@MappingTarget User user, UserUpdateRequest request);
}
