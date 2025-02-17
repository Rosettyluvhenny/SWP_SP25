package com.SWP.SkinCareService.dto.request;

import lombok.Data;

import java.util.Set;
@Data
public class UpdateRoleRequest {
    Set<String> permission;
}
