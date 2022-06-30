/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type NodeSpec = {
    /**
     * Name for the node.
     */
    Name?: string;
    /**
     * User-defined key/value metadata.
     */
    Labels?: Record<string, string>;
    /**
     * Role of the node.
     */
    Role?: NodeSpec.Role;
    /**
     * Availability of the node.
     */
    Availability?: NodeSpec.Availability;
};

export namespace NodeSpec {

    /**
     * Role of the node.
     */
    export enum Role {
        WORKER = 'worker',
        MANAGER = 'manager',
    }

    /**
     * Availability of the node.
     */
    export enum Availability {
        ACTIVE = 'active',
        PAUSE = 'pause',
        DRAIN = 'drain',
    }


}
