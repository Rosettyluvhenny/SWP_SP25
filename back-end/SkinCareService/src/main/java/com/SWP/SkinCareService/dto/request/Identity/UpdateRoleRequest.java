package com.SWP.SkinCareService.dto.request.Identity;

import lombok.Data;

import java.util.Set;
@Data
public class UpdateRoleRequest {
    Set<String> permission;
}
