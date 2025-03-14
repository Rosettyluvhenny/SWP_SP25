/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAuthenticationResponse } from '../models/ApiResponseAuthenticationResponse';
import type { ApiResponseIntrospectResponse } from '../models/ApiResponseIntrospectResponse';
import type { AuthenticationRequest } from '../models/AuthenticationRequest';
import type { IntrospectRequest } from '../models/IntrospectRequest';
import type { LogoutRequest } from '../models/LogoutRequest';
import type { RefreshRequest } from '../models/RefreshRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationControllerService {
    /**
     * @param requestBody
     * @returns ApiResponseAuthenticationResponse OK
     * @throws ApiError
     */
    public static refresh(
        requestBody: RefreshRequest,
    ): CancelablePromise<ApiResponseAuthenticationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static logout(
        requestBody: LogoutRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseIntrospectResponse OK
     * @throws ApiError
     */
    public static introspect(
        requestBody: IntrospectRequest,
    ): CancelablePromise<ApiResponseIntrospectResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/introspect',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseAuthenticationResponse OK
     * @throws ApiError
     */
    public static authenticate(
        requestBody: AuthenticationRequest,
    ): CancelablePromise<ApiResponseAuthenticationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/authenticate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
