package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.Identity.RoleRequest;
import com.SWP.SkinCareService.dto.request.Identity.UpdateRoleRequest;
import com.SWP.SkinCareService.dto.response.RoleResponse;
import com.SWP.SkinCareService.entity.Role;
import com.SWP.SkinCareService.exception.AppException;
import com.SWP.SkinCareService.exception.ErrorCode;
import com.SWP.SkinCareService.mapper.RoleMapper;
import com.SWP.SkinCareService.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    public RoleResponse create(RoleRequest request){
        var role = roleMapper.toRole(request);

        role = roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll(){
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    public void delete(String role){
        roleRepository.deleteById(role);
    }

    public RoleResponse updatePermission(String rolename, UpdateRoleRequest request){
        Role role = roleRepository.findById(rolename).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }
}
