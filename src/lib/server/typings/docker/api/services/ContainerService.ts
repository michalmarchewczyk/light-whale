/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerConfig } from '../models/ContainerConfig';
import type { ContainerState } from '../models/ContainerState';
import type { ContainerSummary } from '../models/ContainerSummary';
import type { ContainerWaitResponse } from '../models/ContainerWaitResponse';
import type { GraphDriverData } from '../models/GraphDriverData';
import type { HostConfig } from '../models/HostConfig';
import type { MountPoint } from '../models/MountPoint';
import type { NetworkingConfig } from '../models/NetworkingConfig';
import type { NetworkSettings } from '../models/NetworkSettings';
import type { Resources } from '../models/Resources';
import type { RestartPolicy } from '../models/RestartPolicy';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContainerService {

    /**
     * List containers
     * Returns a list of containers. For details on the format, see the
 * [inspect endpoint](#operation/ContainerInspect).
 *
 * Note that it uses a different, smaller representation of a container
 * than inspecting a single container. For example, the list of linked
 * containers is not propagated .
 * 
     * @param all Return all containers. By default, only running containers are shown.
 * 
     * @param limit Return this number of most recently created containers, including
 * non-running ones.
 * 
     * @param size Return the size of container as fields `SizeRw` and `SizeRootFs`.
 * 
     * @param filters Filters to process on the container list, encoded as JSON (a
 * `map[string][]string`). For example, `{"status": ["paused"]}` will
 * only return paused containers.
 *
 * Available filters:
 *
 * - `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`)
 * - `before`=(`<container id>` or `<container name>`)
 * - `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
 * - `exited=<int>` containers with exit code of `<int>`
 * - `health`=(`starting`|`healthy`|`unhealthy`|`none`)
 * - `id=<ID>` a container's ID
 * - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon only)
 * - `is-task=`(`true`|`false`)
 * - `label=key` or `label="key=value"` of a container label
 * - `name=<name>` a container's name
 * - `network`=(`<network id>` or `<network name>`)
 * - `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
 * - `since`=(`<container id>` or `<container name>`)
 * - `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
 * - `volume`=(`<volume name>` or `<mount point destination>`)
 * 
     * @returns ContainerSummary no error
     * @throws ApiError
     */
    public static containerList(
all: boolean = false,
limit?: number,
size: boolean = false,
filters?: string,
): CancelablePromise<Array<ContainerSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/json',
            query: {
                'all': all,
                'limit': limit,
                'size': size,
                'filters': filters,
            },
            errors: {
                400: `bad parameter`,
                500: `server error`,
            },
        });
    }

    /**
     * Create a container
     * @param body Container to create
     * @param name Assign the specified name to the container. Must match
 * `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
 * 
     * @returns any Container created successfully
     * @throws ApiError
     */
    public static containerCreate(
body: (ContainerConfig & {
HostConfig?: HostConfig;
NetworkingConfig?: NetworkingConfig;
}),
name?: string,
): CancelablePromise<{
/**
 * The ID of the created container
 */
Id: string;
/**
 * Warnings encountered when creating the container
 */
Warnings: Array<string>;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/create',
            query: {
                'name': name,
            },
            body: body,
            errors: {
                400: `bad parameter`,
                404: `no such image`,
                409: `conflict`,
                500: `server error`,
            },
        });
    }

    /**
     * Inspect a container
     * Return low-level information about a container.
     * @param id ID or name of the container
     * @param size Return the size of container as fields `SizeRw` and `SizeRootFs`
     * @returns any no error
     * @throws ApiError
     */
    public static containerInspect(
id: string,
size: boolean = false,
): CancelablePromise<{
/**
 * The ID of the container
 */
Id?: string;
/**
 * The time the container was created
 */
Created?: string;
/**
 * The path to the command being run
 */
Path?: string;
/**
 * The arguments to the command being run
 */
Args?: Array<string>;
State?: ContainerState | null;
/**
 * The container's image ID
 */
Image?: string;
ResolvConfPath?: string;
HostnamePath?: string;
HostsPath?: string;
LogPath?: string;
Name?: string;
RestartCount?: number;
Driver?: string;
Platform?: string;
MountLabel?: string;
ProcessLabel?: string;
AppArmorProfile?: string;
/**
 * IDs of exec instances that are running in the container.
 */
ExecIDs?: Array<string> | null;
HostConfig?: HostConfig;
GraphDriver?: GraphDriverData;
/**
 * The size of files that have been created or changed by this
 * container.
 * 
 */
SizeRw?: number;
/**
 * The total size of all the files in this container.
 */
SizeRootFs?: number;
Mounts?: Array<MountPoint>;
Config?: ContainerConfig;
NetworkSettings?: NetworkSettings;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/{id}/json',
            path: {
                'id': id,
            },
            query: {
                'size': size,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * List processes running inside a container
     * On Unix systems, this is done by running the `ps` command. This endpoint
 * is not supported on Windows.
 * 
     * @param id ID or name of the container
     * @param psArgs The arguments to pass to `ps`. For example, `aux`
     * @returns any no error
     * @throws ApiError
     */
    public static containerTop(
id: string,
psArgs: string = '-ef',
): CancelablePromise<{
/**
 * The ps column titles
 */
Titles?: Array<string>;
/**
 * Each process running in the container, where each is process
 * is an array of values corresponding to the titles.
 * 
 */
Processes?: Array<Array<string>>;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/{id}/top',
            path: {
                'id': id,
            },
            query: {
                'ps_args': psArgs,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Get container logs
     * Get `stdout` and `stderr` logs from a container.
 *
 * Note: This endpoint works only for containers with the `json-file` or
 * `journald` logging driver.
 * 
     * @param id ID or name of the container
     * @param follow Keep connection after returning logs.
     * @param stdout Return logs from `stdout`
     * @param stderr Return logs from `stderr`
     * @param since Only return logs since this time, as a UNIX timestamp
     * @param until Only return logs before this time, as a UNIX timestamp
     * @param timestamps Add timestamps to every log line
     * @param tail Only return this number of log lines from the end of the logs.
 * Specify as an integer or `all` to output all log lines.
 * 
     * @returns binary logs returned as a stream in response body.
 * For the stream format, [see the documentation for the attach endpoint](#operation/ContainerAttach).
 * Note that unlike the attach endpoint, the logs endpoint does not
 * upgrade the connection and does not set Content-Type.
 * 
     * @throws ApiError
     */
    public static containerLogs(
id: string,
follow: boolean = false,
stdout: boolean = false,
stderr: boolean = false,
since?: number,
until?: number,
timestamps: boolean = false,
tail: string = 'all',
): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/{id}/logs',
            path: {
                'id': id,
            },
            query: {
                'follow': follow,
                'stdout': stdout,
                'stderr': stderr,
                'since': since,
                'until': until,
                'timestamps': timestamps,
                'tail': tail,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Get changes on a container’s filesystem
     * Returns which files in a container's filesystem have been added, deleted,
 * or modified. The `Kind` of modification can be one of:
 *
 * - `0`: Modified
 * - `1`: Added
 * - `2`: Deleted
 * 
     * @param id ID or name of the container
     * @returns any The list of changes
     * @throws ApiError
     */
    public static containerChanges(
id: string,
): CancelablePromise<Array<{
/**
 * Path to file that has changed
 */
Path: string;
/**
 * Kind of change
 */
Kind: 0 | 1 | 2;
}>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/{id}/changes',
            path: {
                'id': id,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Export a container
     * Export the contents of a container as a tarball.
     * @param id ID or name of the container
     * @returns any no error
     * @throws ApiError
     */
    public static containerExport(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/{id}/export',
            path: {
                'id': id,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Get container stats based on resource usage
     * This endpoint returns a live stream of a container’s resource usage
 * statistics.
 *
 * The `precpu_stats` is the CPU statistic of the *previous* read, and is
 * used to calculate the CPU usage percentage. It is not an exact copy
 * of the `cpu_stats` field.
 *
 * If either `precpu_stats.online_cpus` or `cpu_stats.online_cpus` is
 * nil then for compatibility with older daemons the length of the
 * corresponding `cpu_usage.percpu_usage` array should be used.
 *
 * On a cgroup v2 host, the following fields are not set
 * * `blkio_stats`: all fields other than `io_service_bytes_recursive`
 * * `cpu_stats`: `cpu_usage.percpu_usage`
 * * `memory_stats`: `max_usage` and `failcnt`
 * Also, `memory_stats.stats` fields are incompatible with cgroup v1.
 *
 * To calculate the values shown by the `stats` command of the docker cli tool
 * the following formulas can be used:
 * * used_memory = `memory_stats.usage - memory_stats.stats.cache`
 * * available_memory = `memory_stats.limit`
 * * Memory usage % = `(used_memory / available_memory) * 100.0`
 * * cpu_delta = `cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage`
 * * system_cpu_delta = `cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage`
 * * number_cpus = `lenght(cpu_stats.cpu_usage.percpu_usage)` or `cpu_stats.online_cpus`
 * * CPU usage % = `(cpu_delta / system_cpu_delta) * number_cpus * 100.0`
 * 
     * @param id ID or name of the container
     * @param stream Stream the output. If false, the stats will be output once and then
 * it will disconnect.
 * 
     * @param oneShot Only get a single stat instead of waiting for 2 cycles. Must be used
 * with `stream=false`.
 * 
     * @returns any no error
     * @throws ApiError
     */
    public static containerStats(
id: string,
stream: boolean = true,
oneShot: boolean = false,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/{id}/stats',
            path: {
                'id': id,
            },
            query: {
                'stream': stream,
                'one-shot': oneShot,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Resize a container TTY
     * Resize the TTY for a container.
     * @param id ID or name of the container
     * @param h Height of the TTY session in characters
     * @param w Width of the TTY session in characters
     * @returns any no error
     * @throws ApiError
     */
    public static containerResize(
id: string,
h?: number,
w?: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/resize',
            path: {
                'id': id,
            },
            query: {
                'h': h,
                'w': w,
            },
            errors: {
                404: `no such container`,
                500: `cannot resize container`,
            },
        });
    }

    /**
     * Start a container
     * @param id ID or name of the container
     * @param detachKeys Override the key sequence for detaching a container. Format is a
 * single character `[a-Z]` or `ctrl-<value>` where `<value>` is one
 * of: `a-z`, `@`, `^`, `[`, `,` or `_`.
 * 
     * @returns void 
     * @throws ApiError
     */
    public static containerStart(
id: string,
detachKeys?: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/start',
            path: {
                'id': id,
            },
            query: {
                'detachKeys': detachKeys,
            },
            errors: {
                304: `container already started`,
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Stop a container
     * @param id ID or name of the container
     * @param t Number of seconds to wait before killing the container
     * @returns void 
     * @throws ApiError
     */
    public static containerStop(
id: string,
t?: number,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/stop',
            path: {
                'id': id,
            },
            query: {
                't': t,
            },
            errors: {
                304: `container already stopped`,
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Restart a container
     * @param id ID or name of the container
     * @param t Number of seconds to wait before killing the container
     * @returns void 
     * @throws ApiError
     */
    public static containerRestart(
id: string,
t?: number,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/restart',
            path: {
                'id': id,
            },
            query: {
                't': t,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Kill a container
     * Send a POSIX signal to a container, defaulting to killing to the
 * container.
 * 
     * @param id ID or name of the container
     * @param signal Signal to send to the container as an integer or string (e.g. `SIGINT`)
     * @returns void 
     * @throws ApiError
     */
    public static containerKill(
id: string,
signal: string = 'SIGKILL',
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/kill',
            path: {
                'id': id,
            },
            query: {
                'signal': signal,
            },
            errors: {
                404: `no such container`,
                409: `container is not running`,
                500: `server error`,
            },
        });
    }

    /**
     * Update a container
     * Change various configuration options of a container without having to
 * recreate it.
 * 
     * @param id ID or name of the container
     * @param update 
     * @returns any The container has been updated.
     * @throws ApiError
     */
    public static containerUpdate(
id: string,
update: (Resources & {
RestartPolicy?: RestartPolicy;
}),
): CancelablePromise<{
Warnings?: Array<string>;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/update',
            path: {
                'id': id,
            },
            body: update,
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Rename a container
     * @param id ID or name of the container
     * @param name New name for the container
     * @returns void 
     * @throws ApiError
     */
    public static containerRename(
id: string,
name: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/rename',
            path: {
                'id': id,
            },
            query: {
                'name': name,
            },
            errors: {
                404: `no such container`,
                409: `name already in use`,
                500: `server error`,
            },
        });
    }

    /**
     * Pause a container
     * Use the freezer cgroup to suspend all processes in a container.
 *
 * Traditionally, when suspending a process the `SIGSTOP` signal is used,
 * which is observable by the process being suspended. With the freezer
 * cgroup the process is unaware, and unable to capture, that it is being
 * suspended, and subsequently resumed.
 * 
     * @param id ID or name of the container
     * @returns void 
     * @throws ApiError
     */
    public static containerPause(
id: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/pause',
            path: {
                'id': id,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Unpause a container
     * Resume a container which has been paused.
     * @param id ID or name of the container
     * @returns void 
     * @throws ApiError
     */
    public static containerUnpause(
id: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/unpause',
            path: {
                'id': id,
            },
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Attach to a container
     * Attach to a container to read its output or send it input. You can attach
 * to the same container multiple times and you can reattach to containers
 * that have been detached.
 *
 * Either the `stream` or `logs` parameter must be `true` for this endpoint
 * to do anything.
 *
 * See the [documentation for the `docker attach` command](/engine/reference/commandline/attach/)
 * for more details.
 *
 * ### Hijacking
 *
 * This endpoint hijacks the HTTP connection to transport `stdin`, `stdout`,
 * and `stderr` on the same socket.
 *
 * This is the response from the daemon for an attach request:
 *
 * ```
 * HTTP/1.1 200 OK
 * Content-Type: application/vnd.docker.raw-stream
 *
 * [STREAM]
 * ```
 *
 * After the headers and two new lines, the TCP connection can now be used
 * for raw, bidirectional communication between the client and server.
 *
 * To hint potential proxies about connection hijacking, the Docker client
 * can also optionally send connection upgrade headers.
 *
 * For example, the client sends this request to upgrade the connection:
 *
 * ```
 * POST /containers/16253994b7c4/attach?stream=1&stdout=1 HTTP/1.1
 * Upgrade: tcp
 * Connection: Upgrade
 * ```
 *
 * The Docker daemon will respond with a `101 UPGRADED` response, and will
 * similarly follow with the raw stream:
 *
 * ```
 * HTTP/1.1 101 UPGRADED
 * Content-Type: application/vnd.docker.raw-stream
 * Connection: Upgrade
 * Upgrade: tcp
 *
 * [STREAM]
 * ```
 *
 * ### Stream format
 *
 * When the TTY setting is disabled in [`POST /containers/create`](#operation/ContainerCreate),
 * the stream over the hijacked connected is multiplexed to separate out
 * `stdout` and `stderr`. The stream consists of a series of frames, each
 * containing a header and a payload.
 *
 * The header contains the information which the stream writes (`stdout` or
 * `stderr`). It also contains the size of the associated frame encoded in
 * the last four bytes (`uint32`).
 *
 * It is encoded on the first eight bytes like this:
 *
 * ```go
 * header := [8]byte{STREAM_TYPE, 0, 0, 0, SIZE1, SIZE2, SIZE3, SIZE4}
 * ```
 *
 * `STREAM_TYPE` can be:
 *
 * - 0: `stdin` (is written on `stdout`)
 * - 1: `stdout`
 * - 2: `stderr`
 *
 * `SIZE1, SIZE2, SIZE3, SIZE4` are the four bytes of the `uint32` size
 * encoded as big endian.
 *
 * Following the header is the payload, which is the specified number of
 * bytes of `STREAM_TYPE`.
 *
 * The simplest way to implement this protocol is the following:
 *
 * 1. Read 8 bytes.
 * 2. Choose `stdout` or `stderr` depending on the first byte.
 * 3. Extract the frame size from the last four bytes.
 * 4. Read the extracted size and output it on the correct output.
 * 5. Goto 1.
 *
 * ### Stream format when using a TTY
 *
 * When the TTY setting is enabled in [`POST /containers/create`](#operation/ContainerCreate),
 * the stream is not multiplexed. The data exchanged over the hijacked
 * connection is simply the raw data from the process PTY and client's
 * `stdin`.
 * 
     * @param id ID or name of the container
     * @param detachKeys Override the key sequence for detaching a container.Format is a single
 * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
 * `@`, `^`, `[`, `,` or `_`.
 * 
     * @param logs Replay previous logs from the container.
 *
 * This is useful for attaching to a container that has started and you
 * want to output everything since the container started.
 *
 * If `stream` is also enabled, once all the previous output has been
 * returned, it will seamlessly transition into streaming current
 * output.
 * 
     * @param stream Stream attached streams from the time the request was made onwards.
 * 
     * @param stdin Attach to `stdin`
     * @param stdout Attach to `stdout`
     * @param stderr Attach to `stderr`
     * @returns any no error, no upgrade header found
     * @throws ApiError
     */
    public static containerAttach(
id: string,
detachKeys?: string,
logs: boolean = false,
stream: boolean = false,
stdin: boolean = false,
stdout: boolean = false,
stderr: boolean = false,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/attach',
            path: {
                'id': id,
            },
            query: {
                'detachKeys': detachKeys,
                'logs': logs,
                'stream': stream,
                'stdin': stdin,
                'stdout': stdout,
                'stderr': stderr,
            },
            errors: {
                400: `bad parameter`,
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Attach to a container via a websocket
     * @param id ID or name of the container
     * @param detachKeys Override the key sequence for detaching a container.Format is a single
 * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
 * `@`, `^`, `[`, `,`, or `_`.
 * 
     * @param logs Return logs
     * @param stream Return stream
     * @returns any no error, no upgrade header found
     * @throws ApiError
     */
    public static containerAttachWebsocket(
id: string,
detachKeys?: string,
logs: boolean = false,
stream: boolean = false,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/{id}/attach/ws',
            path: {
                'id': id,
            },
            query: {
                'detachKeys': detachKeys,
                'logs': logs,
                'stream': stream,
            },
            errors: {
                400: `bad parameter`,
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Wait for a container
     * Block until a container stops, then returns the exit code.
     * @param id ID or name of the container
     * @param condition Wait until a container state reaches the given condition.
 *
 * Defaults to `not-running` if omitted or empty.
 * 
     * @returns ContainerWaitResponse The container has exit.
     * @throws ApiError
     */
    public static containerWait(
id: string,
condition: 'not-running' | 'next-exit' | 'removed' = 'not-running',
): CancelablePromise<ContainerWaitResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/{id}/wait',
            path: {
                'id': id,
            },
            query: {
                'condition': condition,
            },
            errors: {
                400: `bad parameter`,
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Remove a container
     * @param id ID or name of the container
     * @param v Remove anonymous volumes associated with the container.
     * @param force If the container is running, kill it before removing it.
     * @param link Remove the specified link associated with the container.
     * @returns void 
     * @throws ApiError
     */
    public static containerDelete(
id: string,
v: boolean = false,
force: boolean = false,
link: boolean = false,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/containers/{id}',
            path: {
                'id': id,
            },
            query: {
                'v': v,
                'force': force,
                'link': link,
            },
            errors: {
                400: `bad parameter`,
                404: `no such container`,
                409: `conflict`,
                500: `server error`,
            },
        });
    }

    /**
     * Get information about files in a container
     * A response header `X-Docker-Container-Path-Stat` is returned, containing
 * a base64 - encoded JSON object with some filesystem header information
 * about the path.
 * 
     * @param id ID or name of the container
     * @param path Resource in the container’s filesystem to archive.
     * @returns string no error
     * @throws ApiError
     */
    public static containerArchiveInfo(
id: string,
path: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'HEAD',
            url: '/containers/{id}/archive',
            path: {
                'id': id,
            },
            query: {
                'path': path,
            },
            responseHeader: 'X-Docker-Container-Path-Stat',
            errors: {
                400: `Bad parameter`,
                404: `Container or path does not exist`,
                500: `Server error`,
            },
        });
    }

    /**
     * Get an archive of a filesystem resource in a container
     * Get a tar archive of a resource in the filesystem of container id.
     * @param id ID or name of the container
     * @param path Resource in the container’s filesystem to archive.
     * @returns any no error
     * @throws ApiError
     */
    public static containerArchive(
id: string,
path: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/containers/{id}/archive',
            path: {
                'id': id,
            },
            query: {
                'path': path,
            },
            errors: {
                400: `Bad parameter`,
                404: `Container or path does not exist`,
                500: `server error`,
            },
        });
    }

    /**
     * Extract an archive of files or folders to a directory in a container
     * Upload a tar archive to be extracted to a path in the filesystem of container id.
 * `path` parameter is asserted to be a directory. If it exists as a file, 400 error
 * will be returned with message "not a directory".
 * 
     * @param id ID or name of the container
     * @param path Path to a directory in the container to extract the archive’s contents into. 
     * @param inputStream The input stream must be a tar archive compressed with one of the
 * following algorithms: `identity` (no compression), `gzip`, `bzip2`,
 * or `xz`.
 * 
     * @param noOverwriteDirNonDir If `1`, `true`, or `True` then it will be an error if unpacking the
 * given content would cause an existing directory to be replaced with
 * a non-directory and vice versa.
 * 
     * @param copyUidgid If `1`, `true`, then it will copy UID/GID maps to the dest file or
 * dir
 * 
     * @returns any The content was extracted successfully
     * @throws ApiError
     */
    public static putContainerArchive(
id: string,
path: string,
inputStream: Blob,
noOverwriteDirNonDir?: string,
copyUidgid?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/containers/{id}/archive',
            path: {
                'id': id,
            },
            query: {
                'path': path,
                'noOverwriteDirNonDir': noOverwriteDirNonDir,
                'copyUIDGID': copyUidgid,
            },
            body: inputStream,
            errors: {
                400: `Bad parameter`,
                403: `Permission denied, the volume or container rootfs is marked as read-only.`,
                404: `No such container or path does not exist inside the container`,
                500: `Server error`,
            },
        });
    }

    /**
     * Delete stopped containers
     * @param filters Filters to process on the prune list, encoded as JSON (a `map[string][]string`).
 *
 * Available filters:
 * - `until=<timestamp>` Prune containers created before this timestamp. The `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon machine’s time.
 * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune containers with (or without, in case `label!=...` is used) the specified labels.
 * 
     * @returns any No error
     * @throws ApiError
     */
    public static containerPrune(
filters?: string,
): CancelablePromise<{
/**
 * Container IDs that were deleted
 */
ContainersDeleted?: Array<string>;
/**
 * Disk space reclaimed in bytes
 */
SpaceReclaimed?: number;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/containers/prune',
            query: {
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

}
