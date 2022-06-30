/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerConfig } from '../models/ContainerConfig';
import type { IdResponse } from '../models/IdResponse';
import type { ImageDeleteResponseItem } from '../models/ImageDeleteResponseItem';
import type { ImageInspect } from '../models/ImageInspect';
import type { ImageSummary } from '../models/ImageSummary';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ImageService {

    /**
     * List Images
     * Returns a list of images on the server. Note that it uses a different, smaller representation of an image than inspecting a single image.
     * @param all Show all images. Only images from a final layer (no children) are shown by default.
     * @param filters A JSON encoded value of the filters (a `map[string][]string`) to
 * process on the images list.
 *
 * Available filters:
 *
 * - `before`=(`<image-name>[:<tag>]`,  `<image id>` or `<image@digest>`)
 * - `dangling=true`
 * - `label=key` or `label="key=value"` of an image label
 * - `reference`=(`<image-name>[:<tag>]`)
 * - `since`=(`<image-name>[:<tag>]`,  `<image id>` or `<image@digest>`)
 * 
     * @param digests Show digest information as a `RepoDigests` field on each image.
     * @returns ImageSummary Summary image data for the images matching the query
     * @throws ApiError
     */
    public static imageList(
all: boolean = false,
filters?: string,
digests: boolean = false,
): CancelablePromise<Array<ImageSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/images/json',
            query: {
                'all': all,
                'filters': filters,
                'digests': digests,
            },
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Build an image
     * Build an image from a tar archive with a `Dockerfile` in it.
 *
 * The `Dockerfile` specifies how the image is built from the tar archive. It is typically in the archive's root, but can be at a different path or have a different name by specifying the `dockerfile` parameter. [See the `Dockerfile` reference for more information](/engine/reference/builder/).
 *
 * The Docker daemon performs a preliminary validation of the `Dockerfile` before starting the build, and returns an error if the syntax is incorrect. After that, each instruction is run one-by-one until the ID of the new image is output.
 *
 * The build is canceled if the client drops the connection by quitting or being killed.
 * 
     * @param inputStream A tar archive compressed with one of the following algorithms: identity (no compression), gzip, bzip2, xz.
     * @param dockerfile Path within the build context to the `Dockerfile`. This is ignored if `remote` is specified and points to an external `Dockerfile`.
     * @param t A name and optional tag to apply to the image in the `name:tag` format. If you omit the tag the default `latest` value is assumed. You can provide several `t` parameters.
     * @param extrahosts Extra hosts to add to /etc/hosts
     * @param remote A Git repository URI or HTTP/HTTPS context URI. If the URI points to a single text file, the file’s contents are placed into a file called `Dockerfile` and the image is built from that file. If the URI points to a tarball, the file is downloaded by the daemon and the contents therein used as the context for the build. If the URI points to a tarball and the `dockerfile` parameter is also specified, there must be a file with the corresponding path inside the tarball.
     * @param q Suppress verbose build output.
     * @param nocache Do not use the cache when building the image.
     * @param cachefrom JSON array of images used for build cache resolution.
     * @param pull Attempt to pull the image even if an older image exists locally.
     * @param rm Remove intermediate containers after a successful build.
     * @param forcerm Always remove intermediate containers, even upon failure.
     * @param memory Set memory limit for build.
     * @param memswap Total memory (memory + swap). Set as `-1` to disable swap.
     * @param cpushares CPU shares (relative weight).
     * @param cpusetcpus CPUs in which to allow execution (e.g., `0-3`, `0,1`).
     * @param cpuperiod The length of a CPU period in microseconds.
     * @param cpuquota Microseconds of CPU time that the container can get in a CPU period.
     * @param buildargs JSON map of string pairs for build-time variables. Users pass these values at build-time. Docker uses the buildargs as the environment context for commands run via the `Dockerfile` RUN instruction, or for variable expansion in other `Dockerfile` instructions. This is not meant for passing secret values.
 *
 * For example, the build arg `FOO=bar` would become `{"FOO":"bar"}` in JSON. This would result in the query parameter `buildargs={"FOO":"bar"}`. Note that `{"FOO":"bar"}` should be URI component encoded.
 *
 * [Read more about the buildargs instruction.](/engine/reference/builder/#arg)
 * 
     * @param shmsize Size of `/dev/shm` in bytes. The size must be greater than 0. If omitted the system uses 64MB.
     * @param squash Squash the resulting images layers into a single layer. *(Experimental release only.)*
     * @param labels Arbitrary key/value labels to set on the image, as a JSON map of string pairs.
     * @param networkmode Sets the networking mode for the run commands during build. Supported
 * standard values are: `bridge`, `host`, `none`, and `container:<name|id>`.
 * Any other value is taken as a custom network's name or ID to which this
 * container should connect to.
 * 
     * @param contentType 
     * @param xRegistryConfig This is a base64-encoded JSON object with auth configurations for multiple registries that a build may refer to.
 *
 * The key is a registry URL, and the value is an auth configuration object, [as described in the authentication section](#section/Authentication). For example:
 *
 * ```
 * {
     * "docker.example.com": {
         * "username": "janedoe",
         * "password": "hunter2"
         * },
         * "https://index.docker.io/v1/": {
             * "username": "mobydock",
             * "password": "conta1n3rize14"
             * }
             * }
             * ```
             *
             * Only the registry domain name (and port if not the default 443) are required. However, for legacy reasons, the Docker Hub registry must be specified with both a `https://` prefix and a `/v1/` suffix even though Docker will prefer to use the v2 registry API.
             * 
     * @param platform Platform in the format os[/arch[/variant]]
     * @param target Target build stage
     * @param outputs BuildKit output configuration
     * @returns any no error
     * @throws ApiError
     */
    public static imageBuild(
inputStream?: Blob,
dockerfile: string = 'Dockerfile',
t?: string,
extrahosts?: string,
remote?: string,
q: boolean = false,
nocache: boolean = false,
cachefrom?: string,
pull?: string,
rm: boolean = true,
forcerm: boolean = false,
memory?: number,
memswap?: number,
cpushares?: number,
cpusetcpus?: string,
cpuperiod?: number,
cpuquota?: number,
buildargs?: string,
shmsize?: number,
squash?: boolean,
labels?: string,
networkmode?: string,
contentType: 'application/x-tar' = 'application/x-tar',
xRegistryConfig?: string,
platform: string = '',
target: string = '',
outputs: string = '',
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/build',
            headers: {
                'Content-type': contentType,
                'X-Registry-Config': xRegistryConfig,
            },
            query: {
                'dockerfile': dockerfile,
                't': t,
                'extrahosts': extrahosts,
                'remote': remote,
                'q': q,
                'nocache': nocache,
                'cachefrom': cachefrom,
                'pull': pull,
                'rm': rm,
                'forcerm': forcerm,
                'memory': memory,
                'memswap': memswap,
                'cpushares': cpushares,
                'cpusetcpus': cpusetcpus,
                'cpuperiod': cpuperiod,
                'cpuquota': cpuquota,
                'buildargs': buildargs,
                'shmsize': shmsize,
                'squash': squash,
                'labels': labels,
                'networkmode': networkmode,
                'platform': platform,
                'target': target,
                'outputs': outputs,
            },
            body: inputStream,
            errors: {
                400: `Bad parameter`,
                500: `server error`,
            },
        });
    }

    /**
     * Delete builder cache
     * @param keepStorage Amount of disk space in bytes to keep for cache
     * @param all Remove all types of build cache
     * @param filters A JSON encoded value of the filters (a `map[string][]string`) to
             * process on the list of build cache objects.
             *
             * Available filters:
             *
             * - `until=<duration>`: duration relative to daemon's time, during which build cache was not used, in Go's duration format (e.g., '24h')
             * - `id=<id>`
             * - `parent=<id>`
             * - `type=<string>`
             * - `description=<string>`
             * - `inuse`
             * - `shared`
             * - `private`
             * 
     * @returns any No error
     * @throws ApiError
     */
    public static buildPrune(
keepStorage?: number,
all?: boolean,
filters?: string,
): CancelablePromise<{
CachesDeleted?: Array<string>;
/**
 * Disk space reclaimed in bytes
 */
SpaceReclaimed?: number;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/build/prune',
            query: {
                'keep-storage': keepStorage,
                'all': all,
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Create an image
     * Create an image by either pulling it from a registry or importing it.
     * @param fromImage Name of the image to pull. The name may include a tag or digest. This parameter may only be used when pulling an image. The pull is cancelled if the HTTP connection is closed.
     * @param fromSrc Source to import. The value may be a URL from which the image can be retrieved or `-` to read the image from the request body. This parameter may only be used when importing an image.
     * @param repo Repository name given to an image when it is imported. The repo may include a tag. This parameter may only be used when importing an image.
     * @param tag Tag or digest. If empty when pulling an image, this causes all tags for the given image to be pulled.
     * @param message Set commit message for imported image.
     * @param inputImage Image content if the value `-` has been specified in fromSrc query parameter
     * @param xRegistryAuth A base64url-encoded auth configuration.
             *
             * Refer to the [authentication section](#section/Authentication) for
             * details.
             * 
     * @param changes Apply `Dockerfile` instructions to the image that is created,
             * for example: `changes=ENV DEBUG=true`.
             * Note that `ENV DEBUG=true` should be URI component encoded.
             *
             * Supported `Dockerfile` instructions:
             * `CMD`|`ENTRYPOINT`|`ENV`|`EXPOSE`|`ONBUILD`|`USER`|`VOLUME`|`WORKDIR`
             * 
     * @param platform Platform in the format os[/arch[/variant]]
     * @returns any no error
     * @throws ApiError
     */
    public static imageCreate(
fromImage?: string,
fromSrc?: string,
repo?: string,
tag?: string,
message?: string,
inputImage?: string,
xRegistryAuth?: string,
changes?: Array<string>,
platform: string = '',
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/images/create',
            headers: {
                'X-Registry-Auth': xRegistryAuth,
            },
            query: {
                'fromImage': fromImage,
                'fromSrc': fromSrc,
                'repo': repo,
                'tag': tag,
                'message': message,
                'changes': changes,
                'platform': platform,
            },
            body: inputImage,
            errors: {
                404: `repository does not exist or no read access`,
                500: `server error`,
            },
        });
    }

    /**
     * Inspect an image
     * Return low-level information about an image.
     * @param name Image name or id
     * @returns ImageInspect No error
     * @throws ApiError
     */
    public static imageInspect(
name: string,
): CancelablePromise<ImageInspect> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/images/{name}/json',
            path: {
                'name': name,
            },
            errors: {
                404: `No such image`,
                500: `Server error`,
            },
        });
    }

    /**
     * Get the history of an image
     * Return parent layers of an image.
     * @param name Image name or ID
     * @returns any List of image layers
     * @throws ApiError
     */
    public static imageHistory(
name: string,
): CancelablePromise<Array<{
Id: string;
Created: number;
CreatedBy: string;
Tags: Array<string>;
Size: number;
Comment: string;
}>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/images/{name}/history',
            path: {
                'name': name,
            },
            errors: {
                404: `No such image`,
                500: `Server error`,
            },
        });
    }

    /**
     * Push an image
     * Push an image to a registry.
             *
             * If you wish to push an image on to a private registry, that image must
             * already have a tag which references the registry. For example,
             * `registry.example.com/myimage:latest`.
             *
             * The push is cancelled if the HTTP connection is closed.
             * 
     * @param name Image name or ID.
     * @param xRegistryAuth A base64url-encoded auth configuration.
             *
             * Refer to the [authentication section](#section/Authentication) for
             * details.
             * 
     * @param tag The tag to associate with the image on the registry.
     * @returns any No error
     * @throws ApiError
     */
    public static imagePush(
name: string,
xRegistryAuth: string,
tag?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/images/{name}/push',
            path: {
                'name': name,
            },
            headers: {
                'X-Registry-Auth': xRegistryAuth,
            },
            query: {
                'tag': tag,
            },
            errors: {
                404: `No such image`,
                500: `Server error`,
            },
        });
    }

    /**
     * Tag an image
     * Tag an image so that it becomes part of a repository.
     * @param name Image name or ID to tag.
     * @param repo The repository to tag in. For example, `someuser/someimage`.
     * @param tag The name of the new tag.
     * @returns any No error
     * @throws ApiError
     */
    public static imageTag(
name: string,
repo?: string,
tag?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/images/{name}/tag',
            path: {
                'name': name,
            },
            query: {
                'repo': repo,
                'tag': tag,
            },
            errors: {
                400: `Bad parameter`,
                404: `No such image`,
                409: `Conflict`,
                500: `Server error`,
            },
        });
    }

    /**
     * Remove an image
     * Remove an image, along with any untagged parent images that were
             * referenced by that image.
             *
             * Images can't be removed if they have descendant images, are being
             * used by a running container or are being used by a build.
             * 
     * @param name Image name or ID
     * @param force Remove the image even if it is being used by stopped containers or has other tags
     * @param noprune Do not delete untagged parent images
     * @returns ImageDeleteResponseItem The image was deleted successfully
     * @throws ApiError
     */
    public static imageDelete(
name: string,
force: boolean = false,
noprune: boolean = false,
): CancelablePromise<Array<ImageDeleteResponseItem>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/images/{name}',
            path: {
                'name': name,
            },
            query: {
                'force': force,
                'noprune': noprune,
            },
            errors: {
                404: `No such image`,
                409: `Conflict`,
                500: `Server error`,
            },
        });
    }

    /**
     * Search images
     * Search for an image on Docker Hub.
     * @param term Term to search
     * @param limit Maximum number of results to return
     * @param filters A JSON encoded value of the filters (a `map[string][]string`) to process on the images list. Available filters:
             *
             * - `is-automated=(true|false)`
             * - `is-official=(true|false)`
             * - `stars=<number>` Matches images that has at least 'number' stars.
             * 
     * @returns any No error
     * @throws ApiError
     */
    public static imageSearch(
term: string,
limit?: number,
filters?: string,
): CancelablePromise<Array<{
description?: string;
is_official?: boolean;
is_automated?: boolean;
name?: string;
star_count?: number;
}>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/images/search',
            query: {
                'term': term,
                'limit': limit,
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Delete unused images
     * @param filters Filters to process on the prune list, encoded as JSON (a `map[string][]string`). Available filters:
             *
             * - `dangling=<boolean>` When set to `true` (or `1`), prune only
             * unused *and* untagged images. When set to `false`
             * (or `0`), all unused images are pruned.
             * - `until=<string>` Prune images created before this timestamp. The `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon machine’s time.
             * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune images with (or without, in case `label!=...` is used) the specified labels.
             * 
     * @returns any No error
     * @throws ApiError
     */
    public static imagePrune(
filters?: string,
): CancelablePromise<{
/**
 * Images that were deleted
 */
ImagesDeleted?: Array<ImageDeleteResponseItem>;
/**
 * Disk space reclaimed in bytes
 */
SpaceReclaimed?: number;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/images/prune',
            query: {
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Create a new image from a container
     * @param containerConfig The container configuration
     * @param container The ID or name of the container to commit
     * @param repo Repository name for the created image
     * @param tag Tag name for the create image
     * @param comment Commit message
     * @param author Author of the image (e.g., `John Hannibal Smith <hannibal@a-team.com>`)
     * @param pause Whether to pause the container before committing
     * @param changes `Dockerfile` instructions to apply while committing
     * @returns IdResponse no error
     * @throws ApiError
     */
    public static imageCommit(
containerConfig?: ContainerConfig,
container?: string,
repo?: string,
tag?: string,
comment?: string,
author?: string,
pause: boolean = true,
changes?: string,
): CancelablePromise<IdResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/commit',
            query: {
                'container': container,
                'repo': repo,
                'tag': tag,
                'comment': comment,
                'author': author,
                'pause': pause,
                'changes': changes,
            },
            body: containerConfig,
            errors: {
                404: `no such container`,
                500: `server error`,
            },
        });
    }

    /**
     * Export an image
     * Get a tarball containing all images and metadata for a repository.
             *
             * If `name` is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and its parents) are returned. If `name` is an image ID, similarly only that image (and its parents) are returned, but with the exclusion of the `repositories` file in the tarball, as there were no image names referenced.
             *
             * ### Image tarball format
             *
             * An image tarball contains one directory per image layer (named using its long ID), each containing these files:
             *
             * - `VERSION`: currently `1.0` - the file format version
             * - `json`: detailed layer information, similar to `docker inspect layer_id`
             * - `layer.tar`: A tarfile containing the filesystem changes in this layer
             *
             * The `layer.tar` file contains `aufs` style `.wh..wh.aufs` files and directories for storing attribute changes and deletions.
             *
             * If the tarball defines a repository, the tarball should also include a `repositories` file at the root that contains a list of repository and tag names mapped to layer IDs.
             *
             * ```json
             * {
                 * "hello-world": {
                     * "latest": "565a9d68a73f6706862bfe8409a7f659776d4d60a8d096eb4a3cbce6999cc2a1"
                     * }
                     * }
                     * ```
                     * 
     * @param name Image name or ID
     * @returns binary no error
     * @throws ApiError
     */
    public static imageGet(
name: string,
): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/images/{name}/get',
            path: {
                'name': name,
            },
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Export several images
     * Get a tarball containing all images and metadata for several image
                     * repositories.
                     *
                     * For each value of the `names` parameter: if it is a specific name and
                     * tag (e.g. `ubuntu:latest`), then only that image (and its parents) are
                     * returned; if it is an image ID, similarly only that image (and its parents)
                     * are returned and there would be no names referenced in the 'repositories'
                     * file for this image ID.
                     *
                     * For details on the format, see the [export image endpoint](#operation/ImageGet).
                     * 
     * @param names Image names to filter by
     * @returns binary no error
     * @throws ApiError
     */
    public static imageGetAll(
names?: Array<string>,
): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/images/get',
            query: {
                'names': names,
            },
            errors: {
                500: `server error`,
            },
        });
    }

    /**
     * Import images
     * Load a set of images and tags into a repository.
                     *
                     * For details on the format, see the [export image endpoint](#operation/ImageGet).
                     * 
     * @param imagesTarball Tar archive containing images
     * @param quiet Suppress progress details during load.
     * @returns any no error
     * @throws ApiError
     */
    public static imageLoad(
imagesTarball?: Blob,
quiet: boolean = false,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/images/load',
            query: {
                'quiet': quiet,
            },
            body: imagesTarball,
            errors: {
                500: `server error`,
            },
        });
    }

}
