/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Plugin } from '../models/Plugin';
import type { PluginPrivilege } from '../models/PluginPrivilege';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PluginService {

    /**
     * List plugins
     * Returns information about installed plugins.
     * @param filters A JSON encoded value of the filters (a `map[string][]string`) to
 * process on the plugin list.
 *
 * Available filters:
 *
 * - `capability=<capability name>`
 * - `enable=<true>|<false>`
 * 
     * @returns Plugin No error
     * @throws ApiError
     */
    public static pluginList(
filters?: string,
): CancelablePromise<Array<Plugin>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plugins',
            query: {
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Get plugin privileges
     * @param remote The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @returns PluginPrivilege no error
     * @throws ApiError
     */
    public static getPluginPrivileges(
remote: string,
): CancelablePromise<Array<PluginPrivilege>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plugins/privileges',
            query: {
                'remote': remote,
            },
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Install a plugin
     * Pulls and installs a plugin. After the plugin is installed, it can be
 * enabled using the [`POST /plugins/{name}/enable` endpoint](#operation/PostPluginsEnable).
 * 
     * @param remote Remote reference for plugin to install.
 *
 * The `:latest` tag is optional, and is used as the default if omitted.
 * 
     * @param name Local name for the pulled plugin.
 *
 * The `:latest` tag is optional, and is used as the default if omitted.
 * 
     * @param xRegistryAuth A base64url-encoded auth configuration to use when pulling a plugin
 * from a registry.
 *
 * Refer to the [authentication section](#section/Authentication) for
 * details.
 * 
     * @param body 
     * @returns void 
     * @throws ApiError
     */
    public static pluginPull(
remote: string,
name?: string,
xRegistryAuth?: string,
body?: Array<PluginPrivilege>,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plugins/pull',
            headers: {
                'X-Registry-Auth': xRegistryAuth,
            },
            query: {
                'remote': remote,
                'name': name,
            },
            body: body,
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Inspect a plugin
     * @param name The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @returns Plugin no error
     * @throws ApiError
     */
    public static pluginInspect(
name: string,
): CancelablePromise<Plugin> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plugins/{name}/json',
            path: {
                'name': name,
            },
            errors: {
                404: `plugin is not installed`,
                500: `server error`,
            },
        });
    }

    /**
     * Remove a plugin
     * @param name The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @param force Disable the plugin before removing. This may result in issues if the
 * plugin is in use by a container.
 * 
     * @returns Plugin no error
     * @throws ApiError
     */
    public static pluginDelete(
name: string,
force: boolean = false,
): CancelablePromise<Plugin> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/plugins/{name}',
            path: {
                'name': name,
            },
            query: {
                'force': force,
            },
            errors: {
                404: `plugin is not installed`,
                500: `server error`,
            },
        });
    }

    /**
     * Enable a plugin
     * @param name The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @param timeout Set the HTTP client timeout (in seconds)
     * @returns any no error
     * @throws ApiError
     */
    public static pluginEnable(
name: string,
timeout?: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plugins/{name}/enable',
            path: {
                'name': name,
            },
            query: {
                'timeout': timeout,
            },
            errors: {
                404: `plugin is not installed`,
                500: `server error`,
            },
        });
    }

    /**
     * Disable a plugin
     * @param name The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @returns any no error
     * @throws ApiError
     */
    public static pluginDisable(
name: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plugins/{name}/disable',
            path: {
                'name': name,
            },
            errors: {
                404: `plugin is not installed`,
                500: `server error`,
            },
        });
    }

    /**
     * Upgrade a plugin
     * @param name The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @param remote Remote reference to upgrade to.
 *
 * The `:latest` tag is optional, and is used as the default if omitted.
 * 
     * @param xRegistryAuth A base64url-encoded auth configuration to use when pulling a plugin
 * from a registry.
 *
 * Refer to the [authentication section](#section/Authentication) for
 * details.
 * 
     * @param body 
     * @returns void 
     * @throws ApiError
     */
    public static pluginUpgrade(
name: string,
remote: string,
xRegistryAuth?: string,
body?: Array<PluginPrivilege>,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plugins/{name}/upgrade',
            path: {
                'name': name,
            },
            headers: {
                'X-Registry-Auth': xRegistryAuth,
            },
            query: {
                'remote': remote,
            },
            body: body,
            errors: {
                404: `plugin not installed`,
                500: `server error`,
            },
        });
    }

    /**
     * Create a plugin
     * @param name The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @param tarContext Path to tar containing plugin rootfs and manifest
     * @returns void 
     * @throws ApiError
     */
    public static pluginCreate(
name: string,
tarContext?: Blob,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plugins/create',
            query: {
                'name': name,
            },
            body: tarContext,
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Push a plugin
     * Push a plugin to the registry.
 * 
     * @param name The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @returns any no error
     * @throws ApiError
     */
    public static pluginPush(
name: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plugins/{name}/push',
            path: {
                'name': name,
            },
            errors: {
                404: `plugin not installed`,
                500: `server error`,
            },
        });
    }

    /**
     * Configure a plugin
     * @param name The name of the plugin. The `:latest` tag is optional, and is the
 * default if omitted.
 * 
     * @param body 
     * @returns void 
     * @throws ApiError
     */
    public static pluginSet(
name: string,
body?: Array<string>,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plugins/{name}/set',
            path: {
                'name': name,
            },
            body: body,
            errors: {
                404: `Plugin not installed`,
                500: `Server error`,
            },
        });
    }

}
