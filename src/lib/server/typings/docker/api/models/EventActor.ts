/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Actor describes something that generates events, like a container, network,
 * or a volume.
 * 
 */
export type EventActor = {
    /**
     * The ID of the object emitting the event
     */
    ID?: string;
    /**
     * Various key/value attributes of the object, depending on its type.
 * 
     */
    Attributes?: Record<string, string>;
};
