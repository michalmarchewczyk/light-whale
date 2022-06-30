/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConfigSpec } from './ConfigSpec';
import type { ObjectVersion } from './ObjectVersion';

export type Config = {
    ID?: string;
    Version?: ObjectVersion;
    CreatedAt?: string;
    UpdatedAt?: string;
    Spec?: ConfigSpec;
};
