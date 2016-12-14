import {Component, OnInit} from "@angular/core";
import {LaunchDataService} from "../../Services/LaunchDataService";
import {Status} from "../../Interfaces/Status";
import {WebsocketService} from "../../Services/WebsocketService";
import {NotificationBannerService} from "../../Services/NotificationBannerService";

/**
 * @class
 * The middle tab beneath the 
 */
@Component({
    selector: 'lp-incoming-telemetry-tab',
    template: `
        <ng-container *ngFor="let status of statuses; let i = index">
            <lp-launch-status 
            [launchStatus]="status"
            *ngIf="i < limit"
            (onDelete)="deleteStatus($event)">
            </lp-launch-status>
        </ng-container>    
        <button (click)="showMoreStatuses()">Show More</button>
    `
})
export class IncomingTelemetryTabComponent implements OnInit {

    public limit: number = 50;
    public statuses : Status[];

    constructor(public launchData: LaunchDataService,
                public websocketService: WebsocketService,
                public notificationBanner: NotificationBannerService) {}

    /**
     */
    public ngOnInit() : void {
        //
        this.statuses = this.launchData.statuses.sort((a,b) => a.statusId < b.statusId ? 1 : -1);
    }

    /**
     * Emits a websocket event to delete a launch status by first locating the status to
     * be deleted amongst the list of statuses present, then sends a websocket event.
     *
     * @param statusId {number} The status ID of the launch status that should be deleted.
     */
    public deleteStatus(statusId: number) : void {
        // Find the status
        let statusToBeDeleted = this.statuses.filter(s => s.statusId === statusId)[0];
        // Emit deletion
        this.websocketService.emitLaunchStatusDelete(statusToBeDeleted);
    }

    /**
     * Increase the number of visible statuses on the page by 10.
     */
    public showMoreStatuses() : void {
        this.limit += 10;
    }
}