package com.SWP.SkinCareService.service;

import com.SWP.SkinCareService.dto.request.RoleRequest;
import com.SWP.SkinCareService.dto.request.UpdateRoleRequest;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;
    @PreAuthorize("hasRole('ADMIN')")

    public RoleResponse create(RoleRequest request) {
        var role = roleMapper.toRole(request);

        role = roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }
    @PreAuthorize("hasRole('ADMIN')")

    public List<RoleResponse> getAll() {
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }
    @PreAuthorize("hasRole('ADMIN')")

    public void delete(String rolename) {
        Role role = roleRepository.findById(rolename).orElseThrow(()-> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        roleRepository.deleteById(rolename);
    }
    @PreAuthorize("hasRole('ADMIN')")

    public RoleResponse update(String rolename, UpdateRoleRequest request) {
        Role role = roleRepository.findById(rolename).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        role.setDescription(request.getDescription());
        roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }

}
