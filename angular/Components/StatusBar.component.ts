import {Component, OnInit} from "@angular/core";
import {WebsocketService} from "../Services/WebsocketService";
import {AuthService} from "../Services/AuthService";
import {NotificationBannerService} from "../Services/NotificationBannerService";
import {LaunchDataService} from "../Services/LaunchDataService";
import {Status} from "../Interfaces/Status";

/**
 * @class
 */
@Component({
    selector:'lp-statusbar',
    template: `
        <div id="at-a-glance">
            <p>{{ mostRecentMoment.momentType }}</p>
            <span>Last updated</span>
            <span>{{ launchData.statuses.length }} {{ launchData.statuses.length !== 1 ? "updates" : "update" }}</span>
        </div>
        
        <div id="most-recent-status" *ngIf="authData.isLoggedIn">
             <textarea class="status-entry" (keypress)="onEnterKeypress($event.key)" placeholder="Type launch updates here. Hit enter to send." [(ngModel)]="inProgressStatus" maxlength="500"></textarea>
            <div class="typers">
                <span *ngFor="let typer of typing">{{ typer }}</span>
            </div>
        </div>
        
        <div id="most-recent-status" *ngIf="!authData.isLoggedIn">
            
        </div>
    `
})
export class StatusBarComponent implements OnInit {

    // Admin
    public typing: string[] = [];
    public inProgressStatus: string;

    // Store most recent moment
    public mostRecentMoment : Status;

    constructor(public authData: AuthService,
                public launchData: LaunchDataService,
                public websocketService: WebsocketService,
                public notificationBannerService: NotificationBannerService) {}

    /**
     *
     */
    public ngOnInit() : void {
        this.registerCurrentMoment();

        if (this.authData.isLoggedIn) {
            this.websocketService.typingStatusesStream().subscribe(websocket => {

            });

            this.websocketService.launchStatusResponsesStream().subscribe(websocket => {
                this.notificationBannerService.notify("Launch Status Posted.");
            });

            this.launchData.statusesObservable().subscribe(statuses => {
                this.registerCurrentMoment();
            });
        }
    }

    public registerCurrentMoment() : void {
        this.mostRecentMoment = this.launchData.statuses.filter(s => s.statusType === "moment").pop();
    }

    /**
     *
     * @param key
     */
    public onEnterKeypress(key: string) : boolean {
        if (key === "Enter") {
            this.websocketService.emitLaunchStatusCreate(this.inProgressStatus, "update");
            this.inProgressStatus = "";
            return false;
        }
    }
}