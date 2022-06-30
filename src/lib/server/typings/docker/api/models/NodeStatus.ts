/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NodeState } from './NodeState';

/**
 * NodeStatus represents the status of a node.
 *
 * It provides the current status of the node, as seen by the manager.
 * 
 */
export type NodeStatus = {
    State?: NodeState;
    Message?: string;
    /**
     * IP address of the node.
     */
    Addr?: string;
};
