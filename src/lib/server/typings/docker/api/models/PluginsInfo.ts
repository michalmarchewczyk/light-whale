/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Available plugins per type.
 *
 * <p><br /></p>
 *
 * > **Note**: Only unmanaged (V1) plugins are included in this list.
 * > V1 plugins are "lazily" loaded, and are not returned in this list
 * > if there is no resource using the plugin.
 * 
 */
export type PluginsInfo = {
    /**
     * Names of available volume-drivers, and network-driver plugins.
     */
    Volume?: Array<string>;
    /**
     * Names of available network-drivers, and network-driver plugins.
     */
    Network?: Array<string>;
    /**
     * Names of available authorization plugins.
     */
    Authorization?: Array<string>;
    /**
     * Names of available logging-drivers, and logging-driver plugins.
     */
    Log?: Array<string>;
};
