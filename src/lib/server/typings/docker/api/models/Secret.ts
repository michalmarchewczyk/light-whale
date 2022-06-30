/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectVersion } from './ObjectVersion';
import type { SecretSpec } from './SecretSpec';

export type Secret = {
    ID?: string;
    Version?: ObjectVersion;
    CreatedAt?: string;
    UpdatedAt?: string;
    Spec?: SecretSpec;
};
