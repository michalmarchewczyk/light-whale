/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContainerWaitExitError } from './ContainerWaitExitError';

/**
 * OK response to ContainerWait operation
 */
export type ContainerWaitResponse = {
    /**
     * Exit code of the container
     */
    StatusCode: number;
    Error: ContainerWaitExitError;
};
