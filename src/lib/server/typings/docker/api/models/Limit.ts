/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An object describing a limit on resources which can be requested by a task.
 * 
 */
export type Limit = {
    NanoCPUs?: number;
    MemoryBytes?: number;
    /**
     * Limits the maximum number of PIDs in the container. Set `0` for unlimited.
 * 
     */
    Pids?: number;
};
