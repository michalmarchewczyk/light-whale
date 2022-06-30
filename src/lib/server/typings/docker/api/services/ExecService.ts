/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdResponse } from '../models/IdResponse';
import type { ProcessConfig } from '../models/ProcessConfig';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ExecService {

    /**
     * Create an exec instance
     * Run a command inside a running container.
     * @param execConfig Exec configuration
     * @param id ID or name of container
     * @returns IdResponse no error
     * @throws ApiError
     */
    public static containerExec(
execConfig: {
/**
 * Attach to `stdin` of the exec command.
 */
AttachStdin?: boolean;
/**
 * Attach to `stdout` of the exec command.
 */
AttachStdout?: boolean;
/**
 * Attach to `stderr` of the exec command.
 */
AttachStderr?: boolean;
/**
 * Override the key sequence for detaching a container. Format is
 * a single character `[a-Z]` or `ctrl-<value>` where `<value>`
 * is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
 * 
 */
DetachKeys?: string;
/**
 * Allocate a pseudo-TTY.
 */
Tty?: boolean;
/**
 * A list of environment variables in the form `["VAR=value", ...]`.
 * 
 */
Env?: Array<string>;
/**
 * Command to run, as a string or array of strings.
 */
Cmd?: Array<string>;
/**
 * Runs the exec process with extended privileges.
 */
Privileged?: boolean;
/**
 * The user, and optionally, group to run the exec process inside
 * the container. Format is one of: `user`, `user:group`, `uid`,
 * or `uid:gid`.
 * 
 */
User?: string;
/**
 * The working directory for the exec process inside the container.
 * 
 */
WorkingDir?: string;
},
id: string,
): CancelablePromise<IdResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/exec',
            path: {
                'id': id,
            },
            body: execConfig,
            errors: {
                404: `no such container`,
                409: `container is paused`,
                500: `Server error`,
            },
        });
    }

    /**
     * Start an exec instance
     * Starts a previously set up exec instance. If detach is true, this endpoint
 * returns immediately after starting the command. Otherwise, it sets up an
 * interactive session with the command.
 * 
     * @param id Exec instance ID
     * @param execStartConfig 
     * @returns any No error
     * @throws ApiError
     */
    public static execStart(
id: string,
execStartConfig?: {
/**
 * Detach from the command.
 */
Detach?: boolean;
/**
 * Allocate a pseudo-TTY.
 */
Tty?: boolean;
},
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/exec/{id}/start',
            path: {
                'id': id,
            },
            body: execStartConfig,
            errors: {
                404: `No such exec instance`,
                409: `Container is stopped or paused`,
            },
        });
    }

    /**
     * Resize an exec instance
     * Resize the TTY session used by an exec instance. This endpoint only works
 * if `tty` was specified as part of creating and starting the exec instance.
 * 
     * @param id Exec instance ID
     * @param h Height of the TTY session in characters
     * @param w Width of the TTY session in characters
     * @returns any No error
     * @throws ApiError
     */
    public static execResize(
id: string,
h?: number,
w?: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/exec/{id}/resize',
            path: {
                'id': id,
            },
            query: {
                'h': h,
                'w': w,
            },
            errors: {
                400: `bad parameter`,
                404: `No such exec instance`,
                500: `Server error`,
            },
        });
    }

    /**
     * Inspect an exec instance
     * Return low-level information about an exec instance.
     * @param id Exec instance ID
     * @returns any No error
     * @throws ApiError
     */
    public static execInspect(
id: string,
): CancelablePromise<{
CanRemove?: boolean;
DetachKeys?: string;
ID?: string;
Running?: boolean;
ExitCode?: number;
ProcessConfig?: ProcessConfig;
OpenStdin?: boolean;
OpenStderr?: boolean;
OpenStdout?: boolean;
ContainerID?: string;
/**
 * The system process ID for the exec process.
 */
Pid?: number;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/exec/{id}/json',
            path: {
                'id': id,
            },
            errors: {
                404: `No such exec instance`,
                500: `Server error`,
            },
        });
    }

}
