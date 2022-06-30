/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProgressDetail } from './ProgressDetail';

export type CreateImageInfo = {
    id?: string;
    error?: string;
    status?: string;
    progress?: string;
    progressDetail?: ProgressDetail;
};
