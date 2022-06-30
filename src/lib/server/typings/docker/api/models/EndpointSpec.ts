/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EndpointPortConfig } from './EndpointPortConfig';

/**
 * Properties that can be configured to access and load balance a service.
 */
export type EndpointSpec = {
    /**
     * The mode of resolution to use for internal load balancing between tasks.
 * 
     */
    Mode?: EndpointSpec.Mode;
    /**
     * List of exposed ports that this service is accessible on from the
 * outside. Ports can only be provided if `vip` resolution mode is used.
 * 
     */
    Ports?: Array<EndpointPortConfig>;
};

export namespace EndpointSpec {

    /**
     * The mode of resolution to use for internal load balancing between tasks.
 * 
     */
    export enum Mode {
        VIP = 'vip',
        DNSRR = 'dnsrr',
    }


}
