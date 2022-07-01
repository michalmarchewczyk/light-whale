export type SetupError = 'no-docker' | 'no-ping' | 'no-container' | 'no-image' | 'no-network' | 'no-paths';

export interface SetupStatus {
    systemInfo:{
        os:string;
		cpu: string;
		memory: string;
		hostname: string;
    },
    stage:'no-docker' | 'no-nginx' | 'no-password' | 'done';
    errors:SetupError[];
    working:boolean;
}
