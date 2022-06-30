/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthConfig } from '../models/AuthConfig';
import type { BuildCache } from '../models/BuildCache';
import type { ContainerSummary } from '../models/ContainerSummary';
import type { EventMessage } from '../models/EventMessage';
import type { ImageSummary } from '../models/ImageSummary';
import type { SystemInfo } from '../models/SystemInfo';
import type { SystemVersion } from '../models/SystemVersion';
import type { Volume } from '../models/Volume';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SystemService {

    /**
     * Check auth configuration
     * Validate credentials for a registry and, if available, get an identity
 * token for accessing the registry without password.
 * 
     * @param authConfig Authentication to check
     * @returns any An identity token was generated successfully.
     * @throws ApiError
     */
    public static systemAuth(
authConfig?: AuthConfig,
): CancelablePromise<{
/**
 * The status of the authentication
 */
Status: string;
/**
 * An opaque token used to authenticate a user after a successful login
 */
IdentityToken?: string;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth',
            body: authConfig,
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Get system information
     * @returns SystemInfo No error
     * @throws ApiError
     */
    public static systemInfo(): CancelablePromise<SystemInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/info',
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Get version
     * Returns the version of Docker that is running and various information about the system that Docker is running on.
     * @returns SystemVersion no error
     * @throws ApiError
     */
    public static systemVersion(): CancelablePromise<SystemVersion> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/version',
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Ping
     * This is a dummy endpoint you can use to test if the server is accessible.
     * @returns string no error
     * @throws ApiError
     */
    public static systemPing(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/_ping',
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Ping
     * This is a dummy endpoint you can use to test if the server is accessible.
     * @returns string no error
     * @throws ApiError
     */
    public static systemPingHead(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'HEAD',
            url: '/_ping',
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Monitor events
     * Stream real-time events from the server.
 *
 * Various objects within Docker report events when something happens to them.
 *
 * Containers report these events: `attach`, `commit`, `copy`, `create`, `destroy`, `detach`, `die`, `exec_create`, `exec_detach`, `exec_start`, `exec_die`, `export`, `health_status`, `kill`, `oom`, `pause`, `rename`, `resize`, `restart`, `start`, `stop`, `top`, `unpause`, `update`, and `prune`
 *
 * Images report these events: `delete`, `import`, `load`, `pull`, `push`, `save`, `tag`, `untag`, and `prune`
 *
 * Volumes report these events: `create`, `mount`, `unmount`, `destroy`, and `prune`
 *
 * Networks report these events: `create`, `connect`, `disconnect`, `destroy`, `update`, `remove`, and `prune`
 *
 * The Docker daemon reports these events: `reload`
 *
 * Services report these events: `create`, `update`, and `remove`
 *
 * Nodes report these events: `create`, `update`, and `remove`
 *
 * Secrets report these events: `create`, `update`, and `remove`
 *
 * Configs report these events: `create`, `update`, and `remove`
 *
 * The Builder reports `prune` events
 * 
     * @param since Show events created since this timestamp then stream new events.
     * @param until Show events created until this timestamp then stop streaming.
     * @param filters A JSON encoded value of filters (a `map[string][]string`) to process on the event list. Available filters:
 *
 * - `config=<string>` config name or ID
 * - `container=<string>` container name or ID
 * - `daemon=<string>` daemon name or ID
 * - `event=<string>` event type
 * - `image=<string>` image name or ID
 * - `label=<string>` image or container label
 * - `network=<string>` network name or ID
 * - `node=<string>` node ID
 * - `plugin`=<string> plugin name or ID
 * - `scope`=<string> local or swarm
 * - `secret=<string>` secret name or ID
 * - `service=<string>` service name or ID
 * - `type=<string>` object to filter by, one of `container`, `image`, `volume`, `network`, `daemon`, `plugin`, `node`, `service`, `secret` or `config`
 * - `volume=<string>` volume name
 * 
     * @returns EventMessage no error
     * @throws ApiError
     */
    public static systemEvents(
since?: string,
until?: string,
filters?: string,
): CancelablePromise<EventMessage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events',
            query: {
                'since': since,
                'until': until,
                'filters': filters,
            },
            errors: {
                400: `bad parameter`,
                500: `server error`,
            },
        });
    }

    /**
     * Get data usage information
     * @returns any no error
     * @throws ApiError
     */
    public static systemDataUsage(): CancelablePromise<{
LayersSize?: number;
Images?: Array<ImageSummary>;
Containers?: Array<ContainerSummary>;
Volumes?: Array<Volume>;
BuildCache?: Array<BuildCache>;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/system/df',
            errors: {
                500: `server error`,
            },
        });
    }

}
