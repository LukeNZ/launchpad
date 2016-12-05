import {Component, OnInit} from "@angular/core";
import {WebsocketService} from "../Services/WebsocketService";
import {AuthService} from "../Services/AuthService";
import {NotificationBannerService} from "../Services/NotificationBannerService";
import {LaunchDataService} from "../Services/LaunchDataService";

@Component({
    selector:'tmt-statusbar',
    template: `
        <div id="at-a-glance">
            <p>Current state</p>
            <span>Last updated</span>
            <span>updates</span>
        </div>
        
        <div id="most-recent-status" *ngIf="authData.isLoggedIn">
             <textarea class="status-entry" (keypress)="onEnterKeypress($event.key)" placeholder="Type launch updates here. Hit enter to send." [(ngModel)]="status"></textarea>
            <div class="typers">
                <span *ngFor="let typer of typing">{{ typer }}</span>
            </div>
        </div>
        
        <div id="most-recent-status" *ngIf="!authData.isLoggedIn">
            
        </div>
    `
})
export class StatusBarComponent implements OnInit {

    public typing: string[] = [];
    public status: string;

    constructor(public authData: AuthService,
                public launchData: LaunchDataService,
                public websocketService: WebsocketService,
                public notificationBannerService: NotificationBannerService) {}

    /**
     *
     */
    public ngOnInit() : void {
        if (this.authData.isLoggedIn) {
            this.websocketService.typingStatusesStream().subscribe(websocket => {

            });

            this.websocketService.launchStatusResponsesStream().subscribe(websocket => {
                this.notificationBannerService.notify("Launch Status Posted.");
            });
        }
    }

    /**
     *
     * @param key
     */
    public onEnterKeypress(key: string) : boolean {
        if (key === "Enter") {
            this.websocketService.emitLaunchStatusCreate(this.status, "update");
            this.status = "";
            return false;
        }
    }
}