/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * JoinTokens contains the tokens workers and managers need to join the swarm.
 * 
 */
export type JoinTokens = {
    /**
     * The token workers can use to join the swarm.
 * 
     */
    Worker?: string;
    /**
     * The token managers can use to join the swarm.
 * 
     */
    Manager?: string;
};
