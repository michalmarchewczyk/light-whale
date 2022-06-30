/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The behavior to apply when the container exits. The default is not to
 * restart.
 *
 * An ever increasing delay (double the previous delay, starting at 100ms) is
 * added before each restart to prevent flooding the server.
 * 
 */
export type RestartPolicy = {
    /**
     * - Empty string means not to restart
 * - `no` Do not automatically restart
 * - `always` Always restart
 * - `unless-stopped` Restart always except when the user has manually stopped the container
 * - `on-failure` Restart only when the container exit code is non-zero
 * 
     */
    Name?: RestartPolicy.Name;
    /**
     * If `on-failure` is used, the number of times to retry before giving up.
 * 
     */
    MaximumRetryCount?: number;
};

export namespace RestartPolicy {

    /**
     * - Empty string means not to restart
 * - `no` Do not automatically restart
 * - `always` Always restart
 * - `unless-stopped` Restart always except when the user has manually stopped the container
 * - `on-failure` Restart only when the container exit code is non-zero
 * 
     */
    export enum Name {
         = '',
        NO = 'no',
        ALWAYS = 'always',
        UNLESS_STOPPED = 'unless-stopped',
        ON_FAILURE = 'on-failure',
    }


}
