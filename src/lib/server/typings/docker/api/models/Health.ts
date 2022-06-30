/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HealthcheckResult } from './HealthcheckResult';

/**
 * Health stores information about the container's healthcheck results.
 * 
 */
export type Health = {
    /**
     * Status is one of `none`, `starting`, `healthy` or `unhealthy`
 *
 * - "none"      Indicates there is no healthcheck
 * - "starting"  Starting indicates that the container is not yet ready
 * - "healthy"   Healthy indicates that the container is running correctly
 * - "unhealthy" Unhealthy indicates that the container has a problem
 * 
     */
    Status?: Health.Status;
    /**
     * FailingStreak is the number of consecutive failures
     */
    FailingStreak?: number;
    /**
     * Log contains the last few results (oldest first)
 * 
     */
    Log?: Array<HealthcheckResult>;
};

export namespace Health {

    /**
     * Status is one of `none`, `starting`, `healthy` or `unhealthy`
 *
 * - "none"      Indicates there is no healthcheck
 * - "starting"  Starting indicates that the container is not yet ready
 * - "healthy"   Healthy indicates that the container is running correctly
 * - "unhealthy" Unhealthy indicates that the container has a problem
 * 
     */
    export enum Status {
        NONE = 'none',
        STARTING = 'starting',
        HEALTHY = 'healthy',
        UNHEALTHY = 'unhealthy',
    }


}
