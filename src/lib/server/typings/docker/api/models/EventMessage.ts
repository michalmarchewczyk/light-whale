/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EventActor } from './EventActor';

/**
 * EventMessage represents the information an event contains.
 * 
 */
export type EventMessage = {
    /**
     * The type of object emitting the event
     */
    Type?: EventMessage.Type;
    /**
     * The type of event
     */
    Action?: string;
    Actor?: EventActor;
    /**
     * Scope of the event. Engine events are `local` scope. Cluster (Swarm)
 * events are `swarm` scope.
 * 
     */
    scope?: EventMessage.scope;
    /**
     * Timestamp of event
     */
    time?: number;
    /**
     * Timestamp of event, with nanosecond accuracy
     */
    timeNano?: number;
};

export namespace EventMessage {

    /**
     * The type of object emitting the event
     */
    export enum Type {
        BUILDER = 'builder',
        CONFIG = 'config',
        CONTAINER = 'container',
        DAEMON = 'daemon',
        IMAGE = 'image',
        NETWORK = 'network',
        NODE = 'node',
        PLUGIN = 'plugin',
        SECRET = 'secret',
        SERVICE = 'service',
        VOLUME = 'volume',
    }

    /**
     * Scope of the event. Engine events are `local` scope. Cluster (Swarm)
 * events are `swarm` scope.
 * 
     */
    export enum scope {
        LOCAL = 'local',
        SWARM = 'swarm',
    }


}
