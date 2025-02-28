/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Role } from './Role';
import type { Therapist } from './Therapist';
export type User = {
    id?: string;
    username?: string;
    fullName?: string;
    email?: string;
    password?: string;
    thirdPartyProvider?: string;
    thirdPartyId?: string;
    phone?: string;
    dob?: string;
    roles?: Array<Role>;
    therapist?: Therapist;
    active?: boolean;
};

