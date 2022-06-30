/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EndpointPortConfig } from './EndpointPortConfig';
import type { EndpointSpec } from './EndpointSpec';
import type { ObjectVersion } from './ObjectVersion';
import type { ServiceSpec } from './ServiceSpec';

export type Service = {
    ID?: string;
    Version?: ObjectVersion;
    CreatedAt?: string;
    UpdatedAt?: string;
    Spec?: ServiceSpec;
    Endpoint?: {
Spec?: EndpointSpec;
Ports?: Array<EndpointPortConfig>;
VirtualIPs?: Array<{
NetworkID?: string;
Addr?: string;
}>;
};
    /**
     * The status of a service update.
     */
    UpdateStatus?: {
State?: Service.State;
StartedAt?: string;
CompletedAt?: string;
Message?: string;
};
    /**
     * The status of the service's tasks. Provided only when requested as
 * part of a ServiceList operation.
 * 
     */
    ServiceStatus?: {
/**
 * The number of tasks for the service currently in the Running state.
 * 
 */
RunningTasks?: number;
/**
 * The number of tasks for the service desired to be running.
 * For replicated services, this is the replica count from the
 * service spec. For global services, this is computed by taking
 * count of all tasks for the service with a Desired State other
 * than Shutdown.
 * 
 */
DesiredTasks?: number;
/**
 * The number of tasks for a job that are in the Completed state.
 * This field must be cross-referenced with the service type, as the
 * value of 0 may mean the service is not in a job mode, or it may
 * mean the job-mode service has no tasks yet Completed.
 * 
 */
CompletedTasks?: number;
};
    /**
     * The status of the service when it is in one of ReplicatedJob or
 * GlobalJob modes. Absent on Replicated and Global mode services. The
 * JobIteration is an ObjectVersion, but unlike the Service's version,
 * does not need to be sent with an update request.
 * 
     */
    JobStatus?: {
/**
 * JobIteration is a value increased each time a Job is executed,
 * successfully or otherwise. "Executed", in this case, means the
 * job as a whole has been started, not that an individual Task has
 * been launched. A job is "Executed" when its ServiceSpec is
 * updated. JobIteration can be used to disambiguate Tasks belonging
 * to different executions of a job.  Though JobIteration will
 * increase with each subsequent execution, it may not necessarily
 * increase by 1, and so JobIteration should not be used to
 * 
 */
JobIteration?: ObjectVersion;
/**
 * The last time, as observed by the server, that this job was
 * started.
 * 
 */
LastExecution?: string;
};
};

export namespace Service {

    export enum State {
        UPDATING = 'updating',
        PAUSED = 'paused',
        COMPLETED = 'completed',
    }


}
