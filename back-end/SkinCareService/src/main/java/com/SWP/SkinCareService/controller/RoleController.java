package com.SWP.SkinCareService.controller;

import com.SWP.SkinCareService.dto.request.Identity.RoleRequest;
import com.SWP.SkinCareService.dto.request.Identity.UpdateRoleRequest;
import com.SWP.SkinCareService.dto.response.ApiResponse;
import com.SWP.SkinCareService.dto.response.RoleResponse;
import com.SWP.SkinCareService.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> create(@RequestBody RoleRequest request) {
        return ResponseEntity.status(201).body(
                ApiResponse.<RoleResponse>builder()
                        .code(201)
                        .result(roleService.create(request))
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.<List<RoleResponse>>builder()
                        .code(200)
                        .result(roleService.getAll())
                        .build()
        );
    }

    @DeleteMapping("/{role}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String role) {
        roleService.delete(role);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{rolename}")
    public ResponseEntity<ApiResponse<RoleResponse>> update(@PathVariable String rolename, @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<RoleResponse>builder()
                        .code(200)
                        .result(roleService.update(rolename, request))
                        .build()
        );
    }
}


