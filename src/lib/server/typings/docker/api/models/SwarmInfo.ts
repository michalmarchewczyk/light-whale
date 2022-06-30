/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterInfo } from './ClusterInfo';
import type { LocalNodeState } from './LocalNodeState';
import type { PeerNode } from './PeerNode';

/**
 * Represents generic information about swarm.
 * 
 */
export type SwarmInfo = {
    /**
     * Unique identifier of for this node in the swarm.
     */
    NodeID?: string;
    /**
     * IP address at which this node can be reached by other nodes in the
 * swarm.
 * 
     */
    NodeAddr?: string;
    LocalNodeState?: LocalNodeState;
    ControlAvailable?: boolean;
    Error?: string;
    /**
     * List of ID's and addresses of other managers in the swarm.
 * 
     */
    RemoteManagers?: Array<PeerNode> | null;
    /**
     * Total number of nodes in the swarm.
     */
    Nodes?: number | null;
    /**
     * Total number of managers in the swarm.
     */
    Managers?: number | null;
    Cluster?: ClusterInfo;
};
