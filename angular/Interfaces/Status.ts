export interface Status {
    id: number;
    statusId: number;
    timestamp: Date;
    source: string;
    statusType: string;
    eventType: string
    user: string;
    text: string;
    isDeleted: boolean;
}