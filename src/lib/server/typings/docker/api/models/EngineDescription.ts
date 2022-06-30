/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * EngineDescription provides information about an engine.
 */
export type EngineDescription = {
    EngineVersion?: string;
    Labels?: Record<string, string>;
    Plugins?: Array<{
Type?: string;
Name?: string;
}>;
};
