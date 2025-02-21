package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.RoleRequest;
import com.SWP.SkinCareService.dto.request.UpdateRoleRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.RoleResponse;
import com.SWP.SkinCareService.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> create(@RequestBody RoleRequest request){
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getAll(){
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAll())
                .build();
    }

    @DeleteMapping("/{role}")
    ApiResponse<Void> delete(@PathVariable String role){
        roleService.delete(role);
        return ApiResponse.<Void>builder().build();
    }

    @PutMapping("/{rolename}")
    ApiResponse<RoleResponse> update(@PathVariable String rolename, @RequestBody UpdateRoleRequest request){
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.update(rolename, request))
                .build();
    }

}
