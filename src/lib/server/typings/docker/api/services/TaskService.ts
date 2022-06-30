/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Task } from '../models/Task';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TaskService {

    /**
     * List tasks
     * @param filters A JSON encoded value of the filters (a `map[string][]string`) to
 * process on the tasks list.
 *
 * Available filters:
 *
 * - `desired-state=(running | shutdown | accepted)`
 * - `id=<task id>`
 * - `label=key` or `label="key=value"`
 * - `name=<task name>`
 * - `node=<node id or name>`
 * - `service=<service name>`
 * 
     * @returns Task no error
     * @throws ApiError
     */
    public static taskList(
filters?: string,
): CancelablePromise<Array<Task>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks',
            query: {
                'filters': filters,
            },
            errors: {
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Inspect a task
     * @param id ID of the task
     * @returns Task no error
     * @throws ApiError
     */
    public static taskInspect(
id: string,
): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `no such task`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Get task logs
     * Get `stdout` and `stderr` logs from a task.
 * See also [`/containers/{id}/logs`](#operation/ContainerLogs).
 *
 * **Note**: This endpoint works only for services with the `local`,
 * `json-file` or `journald` logging drivers.
 * 
     * @param id ID of the task
     * @param details Show task context and extra details provided to logs.
     * @param follow Keep connection after returning logs.
     * @param stdout Return logs from `stdout`
     * @param stderr Return logs from `stderr`
     * @param since Only return logs since this time, as a UNIX timestamp
     * @param timestamps Add timestamps to every log line
     * @param tail Only return this number of log lines from the end of the logs.
 * Specify as an integer or `all` to output all log lines.
 * 
     * @returns binary logs returned as a stream in response body
     * @throws ApiError
     */
    public static taskLogs(
id: string,
details: boolean = false,
follow: boolean = false,
stdout: boolean = false,
stderr: boolean = false,
since?: number,
timestamps: boolean = false,
tail: string = 'all',
): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/{id}/logs',
            path: {
                'id': id,
            },
            query: {
                'details': details,
                'follow': follow,
                'stdout': stdout,
                'stderr': stderr,
                'since': since,
                'timestamps': timestamps,
                'tail': tail,
            },
            errors: {
                404: `no such task`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

}
