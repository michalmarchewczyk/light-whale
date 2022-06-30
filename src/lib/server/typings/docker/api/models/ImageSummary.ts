/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ImageSummary = {
    Id: string;
    ParentId: string;
    RepoTags: Array<string>;
    RepoDigests: Array<string>;
    Created: number;
    Size: number;
    SharedSize: number;
    VirtualSize: number;
    Labels: Record<string, string>;
    Containers: number;
};
