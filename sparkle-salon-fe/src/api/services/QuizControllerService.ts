/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { ApiResponseListQuizResponse } from '../models/ApiResponseListQuizResponse';
import type { ApiResponseQuizResponse } from '../models/ApiResponseQuizResponse';
import type { QuizRequest } from '../models/QuizRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuizControllerService {
    /**
     * @param quizId
     * @returns ApiResponseQuizResponse OK
     * @throws ApiError
     */
    public static getQuizById(
        quizId: number,
    ): CancelablePromise<ApiResponseQuizResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/{quizId}',
            path: {
                'quizId': quizId,
            },
        });
    }
    /**
     * @param quizId
     * @param requestBody
     * @returns ApiResponseQuizResponse OK
     * @throws ApiError
     */
    public static updateQuiz(
        quizId: number,
        requestBody: QuizRequest,
    ): CancelablePromise<ApiResponseQuizResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/quiz/{quizId}',
            path: {
                'quizId': quizId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param quizId
     * @returns ApiResponse OK
     * @throws ApiError
     */
    public static deleteQuiz(
        quizId: number,
    ): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/quiz/{quizId}',
            path: {
                'quizId': quizId,
            },
        });
    }
    /**
     * @returns ApiResponseListQuizResponse OK
     * @throws ApiError
     */
    public static getAllQuiz(): CancelablePromise<ApiResponseListQuizResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseQuizResponse OK
     * @throws ApiError
     */
    public static createQuiz(
        requestBody: QuizRequest,
    ): CancelablePromise<ApiResponseQuizResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quiz',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
