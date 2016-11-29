export interface Status {
    id: number;
    statusId: number;
    timestamp: Date;
    countdown: Date;
    isPaused: boolean;
    source: string;
    statusType: string;
    momentType: string
    user: string;
    text: string;
    isDeleted: boolean;
}