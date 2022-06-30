/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * HealthcheckResult stores information about a single run of a healthcheck probe
 * 
 */
export type HealthcheckResult = {
    /**
     * Date and time at which this check started in
 * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
 * 
     */
    Start?: string;
    /**
     * Date and time at which this check ended in
 * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
 * 
     */
    End?: string;
    /**
     * ExitCode meanings:
 *
 * - `0` healthy
 * - `1` unhealthy
 * - `2` reserved (considered unhealthy)
 * - other values: error running probe
 * 
     */
    ExitCode?: number;
    /**
     * Output from last check
     */
    Output?: string;
};
