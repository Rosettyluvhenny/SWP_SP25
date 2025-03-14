/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListUserResponse } from '../models/ApiResponseListUserResponse';
import type { ApiResponseUser } from '../models/ApiResponseUser';
import type { ApiResponseUserResponse } from '../models/ApiResponseUserResponse';
import type { UserRequest } from '../models/UserRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * @param userId
     * @returns ApiResponseUser OK
     * @throws ApiError
     */
    public static getUser(
        userId: string,
    ): CancelablePromise<ApiResponseUser> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param userId
     * @param requestBody
     * @returns ApiResponseUserResponse OK
     * @throws ApiError
     */
    public static update(
        userId: string,
        requestBody: UserUpdateRequest,
    ): CancelablePromise<ApiResponseUserResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param userId
     * @returns any OK
     * @throws ApiError
     */
    public static delete(
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param userId
     * @returns any OK
     * @throws ApiError
     */
    public static disable(
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{userId}/disable',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @returns ApiResponseListUserResponse OK
     * @throws ApiError
     */
    public static getUsers(): CancelablePromise<ApiResponseListUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseUser OK
     * @throws ApiError
     */
    public static createUser(
        requestBody: UserRequest,
    ): CancelablePromise<ApiResponseUser> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseUserResponse OK
     * @throws ApiError
     */
    public static getMyInfo(): CancelablePromise<ApiResponseUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/getMyInfo',
        });
    }
}
