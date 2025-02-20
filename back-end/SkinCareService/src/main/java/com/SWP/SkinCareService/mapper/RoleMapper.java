package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Identity.RoleRequest;
import com.SWP.SkinCareService.dto.response.RoleResponse;
import com.SWP.SkinCareService.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel= "spring")
public interface RoleMapper {
    Role toRole(RoleRequest request);
    RoleResponse toRoleResponse(Role role);

}
