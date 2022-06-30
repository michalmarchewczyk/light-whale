/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Reachability } from './Reachability';

/**
 * ManagerStatus represents the status of a manager.
 *
 * It provides the current status of a node's manager component, if the node
 * is a manager.
 * 
 */
export type ManagerStatus = {
    Leader?: boolean;
    Reachability?: Reachability;
    /**
     * The IP address and port at which the manager is reachable.
 * 
     */
    Addr?: string;
};
