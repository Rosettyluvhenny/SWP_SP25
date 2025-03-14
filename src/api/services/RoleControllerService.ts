/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListRoleResponse } from '../models/ApiResponseListRoleResponse';
import type { ApiResponseRoleResponse } from '../models/ApiResponseRoleResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { RoleRequest } from '../models/RoleRequest';
import type { UpdateRoleRequest } from '../models/UpdateRoleRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoleControllerService {
    /**
     * @param rolename
     * @param requestBody
     * @returns ApiResponseRoleResponse OK
     * @throws ApiError
     */
    public static update2(
        rolename: string,
        requestBody: UpdateRoleRequest,
    ): CancelablePromise<ApiResponseRoleResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/role/{rolename}',
            path: {
                'rolename': rolename,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseListRoleResponse OK
     * @throws ApiError
     */
    public static getAll1(): CancelablePromise<ApiResponseListRoleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/role',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseRoleResponse OK
     * @throws ApiError
     */
    public static create1(
        requestBody: RoleRequest,
    ): CancelablePromise<ApiResponseRoleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/role',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param role
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static delete2(
        role: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/role/{role}',
            path: {
                'role': role,
            },
        });
    }
}
