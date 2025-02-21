package com.SWP.SkinCareService.mapper;


import com.SWP.SkinCareService.dto.request.UserRequestDto;
import com.SWP.SkinCareService.dto.request.UserUpdateRequest;
import com.SWP.SkinCareService.dto.response.UserResponse;
import com.SWP.SkinCareService.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    User toUser(UserRequestDto request);

    UserResponse toUserResponse(User user);

    @Mapping(target ="roles", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    User updateUser(UserUpdateRequest request, @MappingTarget User user);
}
