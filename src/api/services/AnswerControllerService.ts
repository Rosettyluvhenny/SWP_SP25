/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerRequest } from '../models/AnswerRequest';
import type { ApiResponse } from '../models/ApiResponse';
import type { ApiResponseAnswerResponse } from '../models/ApiResponseAnswerResponse';
import type { ApiResponseListAnswerResponse } from '../models/ApiResponseListAnswerResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnswerControllerService {
    /**
     * @param answerId
     * @returns ApiResponseAnswerResponse OK
     * @throws ApiError
     */
    public static getById1(
        answerId: number,
    ): CancelablePromise<ApiResponseAnswerResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/answer/{answerId}',
            path: {
                'answerId': answerId,
            },
        });
    }
    /**
     * @param answerId
     * @param requestBody
     * @returns ApiResponseAnswerResponse OK
     * @throws ApiError
     */
    public static update3(
        answerId: number,
        requestBody: AnswerRequest,
    ): CancelablePromise<ApiResponseAnswerResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/answer/{answerId}',
            path: {
                'answerId': answerId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponse OK
     * @throws ApiError
     */
    public static deleteAnswer(): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/answer/{answerId}',
        });
    }
    /**
     * @returns ApiResponseListAnswerResponse OK
     * @throws ApiError
     */
    public static getAll3(): CancelablePromise<ApiResponseListAnswerResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/answer',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseAnswerResponse OK
     * @throws ApiError
     */
    public static createAnswer(
        requestBody: AnswerRequest,
    ): CancelablePromise<ApiResponseAnswerResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/answer',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param questionId
     * @returns ApiResponseListAnswerResponse OK
     * @throws ApiError
     */
    public static getByQuestionId(
        questionId: number,
    ): CancelablePromise<ApiResponseListAnswerResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/answer/{questionId}/question',
            path: {
                'questionId': questionId,
            },
        });
    }
}
