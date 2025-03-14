/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { ApiResponseListTherapistResponse } from '../models/ApiResponseListTherapistResponse';
import type { ApiResponseTherapistResponse } from '../models/ApiResponseTherapistResponse';
import type { TherapistRequest } from '../models/TherapistRequest';
import type { TherapistUpdateRequest } from '../models/TherapistUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TherapistControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseTherapistResponse OK
     * @throws ApiError
     */
    public static update1(
        id: string,
        requestBody: TherapistUpdateRequest,
    ): CancelablePromise<ApiResponseTherapistResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/therapist/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponse OK
     * @throws ApiError
     */
    public static delete1(
        id: string,
    ): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/therapist/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponse OK
     * @throws ApiError
     */
    public static disable1(
        id: string,
    ): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/therapist/{id}/disable',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseListTherapistResponse OK
     * @throws ApiError
     */
    public static getAll(): CancelablePromise<ApiResponseListTherapistResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/therapist',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseTherapistResponse OK
     * @throws ApiError
     */
    public static create(
        requestBody: TherapistRequest,
    ): CancelablePromise<ApiResponseTherapistResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/therapist',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param therapistId
     * @returns ApiResponseTherapistResponse OK
     * @throws ApiError
     */
    public static getById2(
        therapistId: string,
    ): CancelablePromise<ApiResponseTherapistResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/therapist/{therapistId}',
            path: {
                'therapistId': therapistId,
            },
        });
    }
}
