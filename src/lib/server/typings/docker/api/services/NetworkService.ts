/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EndpointSettings } from '../models/EndpointSettings';
import type { IPAM } from '../models/IPAM';
import type { Network } from '../models/Network';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NetworkService {

    /**
     * List networks
     * Returns a list of networks. For details on the format, see the
 * [network inspect endpoint](#operation/NetworkInspect).
 *
 * Note that it uses a different, smaller representation of a network than
 * inspecting a single network. For example, the list of containers attached
 * to the network is not propagated in API versions 1.28 and up.
 * 
     * @param filters JSON encoded value of the filters (a `map[string][]string`) to process
 * on the networks list.
 *
 * Available filters:
 *
 * - `dangling=<boolean>` When set to `true` (or `1`), returns all
 * networks that are not in use by a container. When set to `false`
 * (or `0`), only networks that are in use by one or more
 * containers are returned.
 * - `driver=<driver-name>` Matches a network's driver.
 * - `id=<network-id>` Matches all or part of a network ID.
 * - `label=<key>` or `label=<key>=<value>` of a network label.
 * - `name=<network-name>` Matches all or part of a network name.
 * - `scope=["swarm"|"global"|"local"]` Filters networks by scope (`swarm`, `global`, or `local`).
 * - `type=["custom"|"builtin"]` Filters networks by type. The `custom` keyword returns all user-defined networks.
 * 
     * @returns Network No error
     * @throws ApiError
     */
    public static networkList(
filters?: string,
): CancelablePromise<Array<Network>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/networks',
            query: {
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Inspect a network
     * @param id Network ID or name
     * @param verbose Detailed inspect output for troubleshooting
     * @param scope Filter the network by scope (swarm, global, or local)
     * @returns Network No error
     * @throws ApiError
     */
    public static networkInspect(
id: string,
verbose: boolean = false,
scope?: string,
): CancelablePromise<Network> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/networks/{id}',
            path: {
                'id': id,
            },
            query: {
                'verbose': verbose,
                'scope': scope,
            },
            errors: {
                404: `Network not found`,
                500: `Server error`,
            },
        });
    }

    /**
     * Remove a network
     * @param id Network ID or name
     * @returns void 
     * @throws ApiError
     */
    public static networkDelete(
id: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/networks/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `operation not supported for pre-defined networks`,
                404: `no such network`,
                500: `Server error`,
            },
        });
    }

    /**
     * Create a network
     * @param networkConfig Network configuration
     * @returns any No error
     * @throws ApiError
     */
    public static networkCreate(
networkConfig: {
/**
 * The network's name.
 */
Name: string;
/**
 * Check for networks with duplicate names. Since Network is
 * primarily keyed based on a random ID and not on the name, and
 * network name is strictly a user-friendly alias to the network
 * which is uniquely identified using ID, there is no guaranteed
 * way to check for duplicates. CheckDuplicate is there to provide
 * a best effort checking of any networks which has the same name
 * but it is not guaranteed to catch all name collisions.
 * 
 */
CheckDuplicate?: boolean;
/**
 * Name of the network driver plugin to use.
 */
Driver?: string;
/**
 * Restrict external access to the network.
 */
Internal?: boolean;
/**
 * Globally scoped network is manually attachable by regular
 * containers from workers in swarm mode.
 * 
 */
Attachable?: boolean;
/**
 * Ingress network is the network which provides the routing-mesh
 * in swarm mode.
 * 
 */
Ingress?: boolean;
/**
 * Optional custom IP scheme for the network.
 */
IPAM?: IPAM;
/**
 * Enable IPv6 on the network.
 */
EnableIPv6?: boolean;
/**
 * Network specific options to be used by the drivers.
 */
Options?: Record<string, string>;
/**
 * User-defined key/value metadata.
 */
Labels?: Record<string, string>;
},
): CancelablePromise<{
/**
 * The ID of the created network.
 */
Id?: string;
Warning?: string;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/networks/create',
            body: networkConfig,
            errors: {
                403: `operation not supported for pre-defined networks`,
                404: `plugin not found`,
                500: `Server error`,
            },
        });
    }

    /**
     * Connect a container to a network
     * @param id Network ID or name
     * @param container 
     * @returns any No error
     * @throws ApiError
     */
    public static networkConnect(
id: string,
container: {
/**
 * The ID or name of the container to connect to the network.
 */
Container?: string;
EndpointConfig?: EndpointSettings;
},
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/networks/{id}/connect',
            path: {
                'id': id,
            },
            body: container,
            errors: {
                403: `Operation not supported for swarm scoped networks`,
                404: `Network or container not found`,
                500: `Server error`,
            },
        });
    }

    /**
     * Disconnect a container from a network
     * @param id Network ID or name
     * @param container 
     * @returns any No error
     * @throws ApiError
     */
    public static networkDisconnect(
id: string,
container: {
/**
 * The ID or name of the container to disconnect from the network.
 * 
 */
Container?: string;
/**
 * Force the container to disconnect from the network.
 * 
 */
Force?: boolean;
},
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/networks/{id}/disconnect',
            path: {
                'id': id,
            },
            body: container,
            errors: {
                403: `Operation not supported for swarm scoped networks`,
                404: `Network or container not found`,
                500: `Server error`,
            },
        });
    }

    /**
     * Delete unused networks
     * @param filters Filters to process on the prune list, encoded as JSON (a `map[string][]string`).
 *
 * Available filters:
 * - `until=<timestamp>` Prune networks created before this timestamp. The `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon machine’s time.
 * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune networks with (or without, in case `label!=...` is used) the specified labels.
 * 
     * @returns any No error
     * @throws ApiError
     */
    public static networkPrune(
filters?: string,
): CancelablePromise<{
/**
 * Networks that were deleted
 */
NetworksDeleted?: Array<string>;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/networks/prune',
            query: {
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

}
