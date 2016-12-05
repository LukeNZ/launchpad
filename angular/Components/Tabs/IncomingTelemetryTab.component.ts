import {Component} from "@angular/core";
import {LaunchDataService} from "../../Services/LaunchDataService";
import {Status} from "../../Interfaces/Status";

@Component({
    selector: 'lp-incoming-telemetry-tab',
    template: `
        <ng-container *ngFor="let status of statuses">
            <lp-launch-status [launchStatus]="status" *ngIf="!status.isDeleted"></lp-launch-status>
        </ng-container>    
    `
})
export class IncomingTelemetryTabComponent {

    public statuses : Status[];

    constructor(public launchData: LaunchDataService) {
        this.launchData.statusesObservable().subscribe(statuses => {
            this.statuses = statuses.sort((a,b) => a.statusId < b.statusId ? 1 : -1);
        });
    }
}