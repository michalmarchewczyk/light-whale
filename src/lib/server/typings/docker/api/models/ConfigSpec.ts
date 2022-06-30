/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Driver } from './Driver';

export type ConfigSpec = {
    /**
     * User-defined name of the config.
     */
    Name?: string;
    /**
     * User-defined key/value metadata.
     */
    Labels?: Record<string, string>;
    /**
     * Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5))
 * config data.
 * 
     */
    Data?: string;
    /**
     * Templating driver, if applicable
 *
 * Templating controls whether and how to evaluate the config payload as
 * a template. If no driver is set, no templating is used.
 * 
     */
    Templating?: Driver;
};
