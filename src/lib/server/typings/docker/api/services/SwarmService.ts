/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Swarm } from '../models/Swarm';
import type { SwarmSpec } from '../models/SwarmSpec';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SwarmService {

    /**
     * Inspect swarm
     * @returns Swarm no error
     * @throws ApiError
     */
    public static swarmInspect(): CancelablePromise<Swarm> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/swarm',
            errors: {
                404: `no such swarm`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Initialize a new swarm
     * @param body 
     * @returns string no error
     * @throws ApiError
     */
    public static swarmInit(
body: {
/**
 * Listen address used for inter-manager communication, as well
 * as determining the networking interface used for the VXLAN
 * Tunnel Endpoint (VTEP). This can either be an address/port
 * combination in the form `192.168.1.1:4567`, or an interface
 * followed by a port number, like `eth0:4567`. If the port number
 * is omitted, the default swarm listening port is used.
 * 
 */
ListenAddr?: string;
/**
 * Externally reachable address advertised to other nodes. This
 * can either be an address/port combination in the form
 * `192.168.1.1:4567`, or an interface followed by a port number,
 * like `eth0:4567`. If the port number is omitted, the port
 * number from the listen address is used. If `AdvertiseAddr` is
 * not specified, it will be automatically detected when possible.
 * 
 */
AdvertiseAddr?: string;
/**
 * Address or interface to use for data path traffic (format:
 * `<ip|interface>`), for example,  `192.168.1.1`, or an interface,
 * like `eth0`. If `DataPathAddr` is unspecified, the same address
 * as `AdvertiseAddr` is used.
 *
 * The `DataPathAddr` specifies the address that global scope
 * network drivers will publish towards other  nodes in order to
 * reach the containers running on this node. Using this parameter
 * it is possible to separate the container data traffic from the
 * management traffic of the cluster.
 * 
 */
DataPathAddr?: string;
/**
 * DataPathPort specifies the data path port number for data traffic.
 * Acceptable port range is 1024 to 49151.
 * if no port is set or is set to 0, default port 4789 will be used.
 * 
 */
DataPathPort?: number;
/**
 * Default Address Pool specifies default subnet pools for global
 * scope networks.
 * 
 */
DefaultAddrPool?: Array<string>;
/**
 * Force creation of a new swarm.
 */
ForceNewCluster?: boolean;
/**
 * SubnetSize specifies the subnet size of the networks created
 * from the default subnet pool.
 * 
 */
SubnetSize?: number;
Spec?: SwarmSpec;
},
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/swarm/init',
            body: body,
            errors: {
                400: `bad parameter`,
                500: `server error`,
                503: `node is already part of a swarm`,
            },
        });
    }

    /**
     * Join an existing swarm
     * @param body 
     * @returns any no error
     * @throws ApiError
     */
    public static swarmJoin(
body: {
/**
 * Listen address used for inter-manager communication if the node
 * gets promoted to manager, as well as determining the networking
 * interface used for the VXLAN Tunnel Endpoint (VTEP).
 * 
 */
ListenAddr?: string;
/**
 * Externally reachable address advertised to other nodes. This
 * can either be an address/port combination in the form
 * `192.168.1.1:4567`, or an interface followed by a port number,
 * like `eth0:4567`. If the port number is omitted, the port
 * number from the listen address is used. If `AdvertiseAddr` is
 * not specified, it will be automatically detected when possible.
 * 
 */
AdvertiseAddr?: string;
/**
 * Address or interface to use for data path traffic (format:
 * `<ip|interface>`), for example,  `192.168.1.1`, or an interface,
 * like `eth0`. If `DataPathAddr` is unspecified, the same addres
 * as `AdvertiseAddr` is used.
 *
 * The `DataPathAddr` specifies the address that global scope
 * network drivers will publish towards other nodes in order to
 * reach the containers running on this node. Using this parameter
 * it is possible to separate the container data traffic from the
 * management traffic of the cluster.
 * 
 */
DataPathAddr?: string;
/**
 * Addresses of manager nodes already participating in the swarm.
 * 
 */
RemoteAddrs?: Array<string>;
/**
 * Secret token for joining this swarm.
 */
JoinToken?: string;
},
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/swarm/join',
            body: body,
            errors: {
                400: `bad parameter`,
                500: `server error`,
                503: `node is already part of a swarm`,
            },
        });
    }

    /**
     * Leave a swarm
     * @param force Force leave swarm, even if this is the last manager or that it will
 * break the cluster.
 * 
     * @returns any no error
     * @throws ApiError
     */
    public static swarmLeave(
force: boolean = false,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/swarm/leave',
            query: {
                'force': force,
            },
            errors: {
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Update a swarm
     * @param body 
     * @param version The version number of the swarm object being updated. This is
 * required to avoid conflicting writes.
 * 
     * @param rotateWorkerToken Rotate the worker join token.
     * @param rotateManagerToken Rotate the manager join token.
     * @param rotateManagerUnlockKey Rotate the manager unlock key.
     * @returns any no error
     * @throws ApiError
     */
    public static swarmUpdate(
body: SwarmSpec,
version: number,
rotateWorkerToken: boolean = false,
rotateManagerToken: boolean = false,
rotateManagerUnlockKey: boolean = false,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/swarm/update',
            query: {
                'version': version,
                'rotateWorkerToken': rotateWorkerToken,
                'rotateManagerToken': rotateManagerToken,
                'rotateManagerUnlockKey': rotateManagerUnlockKey,
            },
            body: body,
            errors: {
                400: `bad parameter`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Get the unlock key
     * @returns any no error
     * @throws ApiError
     */
    public static swarmUnlockkey(): CancelablePromise<{
/**
 * The swarm's unlock key.
 */
UnlockKey?: string;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/swarm/unlockkey',
            errors: {
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Unlock a locked manager
     * @param body 
     * @returns any no error
     * @throws ApiError
     */
    public static swarmUnlock(
body: {
/**
 * The swarm's unlock key.
 */
UnlockKey?: string;
},
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/swarm/unlock',
            body: body,
            errors: {
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

}
