/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EndpointSpec } from './EndpointSpec';
import type { NetworkAttachmentConfig } from './NetworkAttachmentConfig';
import type { TaskSpec } from './TaskSpec';

/**
 * User modifiable configuration for a service.
 */
export type ServiceSpec = {
    /**
     * Name of the service.
     */
    Name?: string;
    /**
     * User-defined key/value metadata.
     */
    Labels?: Record<string, string>;
    TaskTemplate?: TaskSpec;
    /**
     * Scheduling mode for the service.
     */
    Mode?: {
Replicated?: {
Replicas?: number;
};
Global?: any;
/**
 * The mode used for services with a finite number of tasks that run
 * to a completed state.
 * 
 */
ReplicatedJob?: {
/**
 * The maximum number of replicas to run simultaneously.
 * 
 */
MaxConcurrent?: number;
/**
 * The total number of replicas desired to reach the Completed
 * state. If unset, will default to the value of `MaxConcurrent`
 * 
 */
TotalCompletions?: number;
};
/**
 * The mode used for services which run a task to the completed state
 * on each valid node.
 * 
 */
GlobalJob?: any;
};
    /**
     * Specification for the update strategy of the service.
     */
    UpdateConfig?: {
/**
 * Maximum number of tasks to be updated in one iteration (0 means
 * unlimited parallelism).
 * 
 */
Parallelism?: number;
/**
 * Amount of time between updates, in nanoseconds.
 */
Delay?: number;
/**
 * Action to take if an updated task fails to run, or stops running
 * during the update.
 * 
 */
FailureAction?: ServiceSpec.FailureAction;
/**
 * Amount of time to monitor each updated task for failures, in
 * nanoseconds.
 * 
 */
Monitor?: number;
/**
 * The fraction of tasks that may fail during an update before the
 * failure action is invoked, specified as a floating point number
 * between 0 and 1.
 * 
 */
MaxFailureRatio?: number;
/**
 * The order of operations when rolling out an updated task. Either
 * the old task is shut down before the new task is started, or the
 * new task is started before the old task is shut down.
 * 
 */
Order?: ServiceSpec.Order;
};
    /**
     * Specification for the rollback strategy of the service.
     */
    RollbackConfig?: {
/**
 * Maximum number of tasks to be rolled back in one iteration (0 means
 * unlimited parallelism).
 * 
 */
Parallelism?: number;
/**
 * Amount of time between rollback iterations, in nanoseconds.
 * 
 */
Delay?: number;
/**
 * Action to take if an rolled back task fails to run, or stops
 * running during the rollback.
 * 
 */
FailureAction?: ServiceSpec.FailureAction;
/**
 * Amount of time to monitor each rolled back task for failures, in
 * nanoseconds.
 * 
 */
Monitor?: number;
/**
 * The fraction of tasks that may fail during a rollback before the
 * failure action is invoked, specified as a floating point number
 * between 0 and 1.
 * 
 */
MaxFailureRatio?: number;
/**
 * The order of operations when rolling back a task. Either the old
 * task is shut down before the new task is started, or the new task
 * is started before the old task is shut down.
 * 
 */
Order?: ServiceSpec.Order;
};
    /**
     * Specifies which networks the service should attach to.
     */
    Networks?: Array<NetworkAttachmentConfig>;
    EndpointSpec?: EndpointSpec;
};

export namespace ServiceSpec {

    /**
     * Action to take if an updated task fails to run, or stops running
 * during the update.
 * 
     */
    export enum FailureAction {
        CONTINUE = 'continue',
        PAUSE = 'pause',
        ROLLBACK = 'rollback',
    }

    /**
     * The order of operations when rolling out an updated task. Either
 * the old task is shut down before the new task is started, or the
 * new task is started before the old task is shut down.
 * 
     */
    export enum Order {
        STOP_FIRST = 'stop-first',
        START_FIRST = 'start-first',
    }


}
