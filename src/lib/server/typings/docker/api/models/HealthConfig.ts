/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A test to perform to check that the container is healthy.
 */
export type HealthConfig = {
    /**
     * The test to perform. Possible values are:
 *
 * - `[]` inherit healthcheck from image or parent image
 * - `["NONE"]` disable healthcheck
 * - `["CMD", args...]` exec arguments directly
 * - `["CMD-SHELL", command]` run command with system's default shell
 * 
     */
    Test?: Array<string>;
    /**
     * The time to wait between checks in nanoseconds. It should be 0 or at
 * least 1000000 (1 ms). 0 means inherit.
 * 
     */
    Interval?: number;
    /**
     * The time to wait before considering the check to have hung. It should
 * be 0 or at least 1000000 (1 ms). 0 means inherit.
 * 
     */
    Timeout?: number;
    /**
     * The number of consecutive failures needed to consider a container as
 * unhealthy. 0 means inherit.
 * 
     */
    Retries?: number;
    /**
     * Start period for the container to initialize before starting
 * health-retries countdown in nanoseconds. It should be 0 or at least
 * 1000000 (1 ms). 0 means inherit.
 * 
     */
    StartPeriod?: number;
};
