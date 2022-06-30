/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Health } from './Health';

/**
 * ContainerState stores container's running state. It's part of ContainerJSONBase
 * and will be returned by the "inspect" command.
 * 
 */
export type ContainerState = {
    /**
     * String representation of the container state. Can be one of "created",
 * "running", "paused", "restarting", "removing", "exited", or "dead".
 * 
     */
    Status?: ContainerState.Status;
    /**
     * Whether this container is running.
 *
 * Note that a running container can be _paused_. The `Running` and `Paused`
 * booleans are not mutually exclusive:
 *
 * When pausing a container (on Linux), the freezer cgroup is used to suspend
 * all processes in the container. Freezing the process requires the process to
 * be running. As a result, paused containers are both `Running` _and_ `Paused`.
 *
 * Use the `Status` field instead to determine if a container's state is "running".
 * 
     */
    Running?: boolean;
    /**
     * Whether this container is paused.
     */
    Paused?: boolean;
    /**
     * Whether this container is restarting.
     */
    Restarting?: boolean;
    /**
     * Whether this container has been killed because it ran out of memory.
 * 
     */
    OOMKilled?: boolean;
    Dead?: boolean;
    /**
     * The process ID of this container
     */
    Pid?: number;
    /**
     * The last exit code of this container
     */
    ExitCode?: number;
    Error?: string;
    /**
     * The time when this container was last started.
     */
    StartedAt?: string;
    /**
     * The time when this container last exited.
     */
    FinishedAt?: string;
    Health?: Health | null;
};

export namespace ContainerState {

    /**
     * String representation of the container state. Can be one of "created",
 * "running", "paused", "restarting", "removing", "exited", or "dead".
 * 
     */
    export enum Status {
        CREATED = 'created',
        RUNNING = 'running',
        PAUSED = 'paused',
        RESTARTING = 'restarting',
        REMOVING = 'removing',
        EXITED = 'exited',
        DEAD = 'dead',
    }


}
