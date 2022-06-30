/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents a peer-node in the swarm
 */
export type PeerNode = {
    /**
     * Unique identifier of for this node in the swarm.
     */
    NodeID?: string;
    /**
     * IP address and ports at which this node can be reached.
 * 
     */
    Addr?: string;
};
