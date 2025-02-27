/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { ApiResponseListQuestionResponse } from '../models/ApiResponseListQuestionResponse';
import type { ApiResponseQuestionResponse } from '../models/ApiResponseQuestionResponse';
import type { QuestionRequest } from '../models/QuestionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionControllerService {
    /**
     * @returns ApiResponseQuestionResponse OK
     * @throws ApiError
     */
    public static getById(): CancelablePromise<ApiResponseQuestionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/question/{questionId}',
        });
    }
    /**
     * @param questionId
     * @param requestBody
     * @returns ApiResponseQuestionResponse OK
     * @throws ApiError
     */
    public static updateQuestion(
        questionId: number,
        requestBody: QuestionRequest,
    ): CancelablePromise<ApiResponseQuestionResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/question/{questionId}',
            path: {
                'questionId': questionId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param questionId
     * @returns ApiResponse OK
     * @throws ApiError
     */
    public static deleteQuestion(
        questionId: number,
    ): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/question/{questionId}',
            path: {
                'questionId': questionId,
            },
        });
    }
    /**
     * @returns ApiResponseListQuestionResponse OK
     * @throws ApiError
     */
    public static getAll2(): CancelablePromise<ApiResponseListQuestionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/question',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseQuestionResponse OK
     * @throws ApiError
     */
    public static createQuestion(
        requestBody: QuestionRequest,
    ): CancelablePromise<ApiResponseQuestionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param quizId
     * @returns ApiResponseListQuestionResponse OK
     * @throws ApiError
     */
    public static getByQuizId(
        quizId: number,
    ): CancelablePromise<ApiResponseListQuestionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/question/{quizId}/Quizzes',
            path: {
                'quizId': quizId,
            },
        });
    }
}
