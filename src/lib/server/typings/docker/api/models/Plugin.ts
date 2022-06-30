/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PluginDevice } from './PluginDevice';
import type { PluginEnv } from './PluginEnv';
import type { PluginInterfaceType } from './PluginInterfaceType';
import type { PluginMount } from './PluginMount';

/**
 * A plugin for the Engine API
 */
export type Plugin = {
    Id?: string;
    Name: string;
    /**
     * True if the plugin is running. False if the plugin is not running, only installed.
     */
    Enabled: boolean;
    /**
     * Settings that can be modified by users.
     */
    Settings: {
Mounts: Array<PluginMount>;
Env: Array<string>;
Args: Array<string>;
Devices: Array<PluginDevice>;
};
    /**
     * plugin remote reference used to push/pull the plugin
     */
    PluginReference?: string;
    /**
     * The config of a plugin.
     */
    Config: {
/**
 * Docker Version used to create the plugin
 */
DockerVersion?: string;
Description: string;
Documentation: string;
/**
 * The interface between Docker and the plugin
 */
Interface: {
Types: Array<PluginInterfaceType>;
Socket: string;
/**
 * Protocol to use for clients connecting to the plugin.
 */
ProtocolScheme?: Plugin.ProtocolScheme;
};
Entrypoint: Array<string>;
WorkDir: string;
User?: {
UID?: number;
GID?: number;
};
Network: {
Type: string;
};
Linux: {
Capabilities: Array<string>;
AllowAllDevices: boolean;
Devices: Array<PluginDevice>;
};
PropagatedMount: string;
IpcHost: boolean;
PidHost: boolean;
Mounts: Array<PluginMount>;
Env: Array<PluginEnv>;
Args: {
Name: string;
Description: string;
Settable: Array<string>;
Value: Array<string>;
};
rootfs?: {
type?: string;
diff_ids?: Array<string>;
};
};
};

export namespace Plugin {

    /**
     * Protocol to use for clients connecting to the plugin.
     */
    export enum ProtocolScheme {
         = '',
        MOBY_PLUGINS_HTTP_V1 = 'moby.plugins.http/v1',
    }


}
