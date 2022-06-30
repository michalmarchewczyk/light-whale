/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DeviceMapping } from './DeviceMapping';
import type { DeviceRequest } from './DeviceRequest';
import type { ThrottleDevice } from './ThrottleDevice';

/**
 * A container's resources (cgroups config, ulimits, etc)
 */
export type Resources = {
    /**
     * An integer value representing this container's relative CPU weight
 * versus other containers.
 * 
     */
    CpuShares?: number;
    /**
     * Memory limit in bytes.
     */
    Memory?: number;
    /**
     * Path to `cgroups` under which the container's `cgroup` is created. If
 * the path is not absolute, the path is considered to be relative to the
 * `cgroups` path of the init process. Cgroups are created if they do not
 * already exist.
 * 
     */
    CgroupParent?: string;
    /**
     * Block IO weight (relative weight).
     */
    BlkioWeight?: number;
    /**
     * Block IO weight (relative device weight) in the form:
 *
 * ```
 * [{"Path": "device_path", "Weight": weight}]
 * ```
 * 
     */
    BlkioWeightDevice?: Array<{
Path?: string;
Weight?: number;
}>;
    /**
     * Limit read rate (bytes per second) from a device, in the form:
 *
 * ```
 * [{"Path": "device_path", "Rate": rate}]
 * ```
 * 
     */
    BlkioDeviceReadBps?: Array<ThrottleDevice>;
    /**
     * Limit write rate (bytes per second) to a device, in the form:
 *
 * ```
 * [{"Path": "device_path", "Rate": rate}]
 * ```
 * 
     */
    BlkioDeviceWriteBps?: Array<ThrottleDevice>;
    /**
     * Limit read rate (IO per second) from a device, in the form:
 *
 * ```
 * [{"Path": "device_path", "Rate": rate}]
 * ```
 * 
     */
    BlkioDeviceReadIOps?: Array<ThrottleDevice>;
    /**
     * Limit write rate (IO per second) to a device, in the form:
 *
 * ```
 * [{"Path": "device_path", "Rate": rate}]
 * ```
 * 
     */
    BlkioDeviceWriteIOps?: Array<ThrottleDevice>;
    /**
     * The length of a CPU period in microseconds.
     */
    CpuPeriod?: number;
    /**
     * Microseconds of CPU time that the container can get in a CPU period.
 * 
     */
    CpuQuota?: number;
    /**
     * The length of a CPU real-time period in microseconds. Set to 0 to
 * allocate no time allocated to real-time tasks.
 * 
     */
    CpuRealtimePeriod?: number;
    /**
     * The length of a CPU real-time runtime in microseconds. Set to 0 to
 * allocate no time allocated to real-time tasks.
 * 
     */
    CpuRealtimeRuntime?: number;
    /**
     * CPUs in which to allow execution (e.g., `0-3`, `0,1`).
 * 
     */
    CpusetCpus?: string;
    /**
     * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only
 * effective on NUMA systems.
 * 
     */
    CpusetMems?: string;
    /**
     * A list of devices to add to the container.
     */
    Devices?: Array<DeviceMapping>;
    /**
     * a list of cgroup rules to apply to the container
     */
    DeviceCgroupRules?: Array<string>;
    /**
     * A list of requests for devices to be sent to device drivers.
 * 
     */
    DeviceRequests?: Array<DeviceRequest>;
    /**
     * Kernel memory limit in bytes.
 *
 * <p><br /></p>
 *
 * > **Deprecated**: This field is deprecated as the kernel 5.4 deprecated
 * > `kmem.limit_in_bytes`.
 * 
     */
    KernelMemory?: number;
    /**
     * Hard limit for kernel TCP buffer memory (in bytes).
     */
    KernelMemoryTCP?: number;
    /**
     * Memory soft limit in bytes.
     */
    MemoryReservation?: number;
    /**
     * Total memory limit (memory + swap). Set as `-1` to enable unlimited
 * swap.
 * 
     */
    MemorySwap?: number;
    /**
     * Tune a container's memory swappiness behavior. Accepts an integer
 * between 0 and 100.
 * 
     */
    MemorySwappiness?: number;
    /**
     * CPU quota in units of 10<sup>-9</sup> CPUs.
     */
    NanoCpus?: number;
    /**
     * Disable OOM Killer for the container.
     */
    OomKillDisable?: boolean;
    /**
     * Run an init inside the container that forwards signals and reaps
 * processes. This field is omitted if empty, and the default (as
 * configured on the daemon) is used.
 * 
     */
    Init?: boolean | null;
    /**
     * Tune a container's PIDs limit. Set `0` or `-1` for unlimited, or `null`
 * to not change.
 * 
     */
    PidsLimit?: number | null;
    /**
     * A list of resource limits to set in the container. For example:
 *
 * ```
 * {"Name": "nofile", "Soft": 1024, "Hard": 2048}
 * ```
 * 
     */
    Ulimits?: Array<{
/**
 * Name of ulimit
 */
Name?: string;
/**
 * Soft limit
 */
Soft?: number;
/**
 * Hard limit
 */
Hard?: number;
}>;
    /**
     * The number of usable CPUs (Windows only).
 *
 * On Windows Server containers, the processor resource controls are
 * mutually exclusive. The order of precedence is `CPUCount` first, then
 * `CPUShares`, and `CPUPercent` last.
 * 
     */
    CpuCount?: number;
    /**
     * The usable percentage of the available CPUs (Windows only).
 *
 * On Windows Server containers, the processor resource controls are
 * mutually exclusive. The order of precedence is `CPUCount` first, then
 * `CPUShares`, and `CPUPercent` last.
 * 
     */
    CpuPercent?: number;
    /**
     * Maximum IOps for the container system drive (Windows only)
     */
    IOMaximumIOps?: number;
    /**
     * Maximum IO in bytes per second for the container system drive
 * (Windows only).
 * 
     */
    IOMaximumBandwidth?: number;
};
