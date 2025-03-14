/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Answer } from './Answer';
import type { Quiz } from './Quiz';
export type Question = {
    id?: number;
    quiz?: Quiz;
    text?: string;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
    answers?: Array<Answer>;
};

