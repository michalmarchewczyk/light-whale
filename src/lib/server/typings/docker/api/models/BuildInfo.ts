/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ErrorDetail } from './ErrorDetail';
import type { ImageID } from './ImageID';
import type { ProgressDetail } from './ProgressDetail';

export type BuildInfo = {
    id?: string;
    stream?: string;
    error?: string;
    errorDetail?: ErrorDetail;
    status?: string;
    progress?: string;
    progressDetail?: ProgressDetail;
    aux?: ImageID;
};
