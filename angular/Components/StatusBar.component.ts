import {Component, OnInit} from "@angular/core";
import {WebsocketService} from "../Services/WebsocketService";
import {AuthService} from "../Services/AuthService";
import {NotificationBannerService} from "../Services/NotificationBannerService";
import {Launch} from "../Classes/Launch";
import {LaunchDataService} from "../Services/LaunchDataService";

@Component({
    selector:'tmt-statusbar',
    template: `
        <textarea class="status-entry" (keypress)="onEnterKeypress($event.key)" placeholder="Type launch updates here. Hit enter to send." [(ngModel)]="status"></textarea>
        <div class="typers">
            <span *ngFor="let typer of typing">{{ typer }}</span>
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
            this.websocketService.typingStatusesStream().subscribe(msg => {

            });

            this.websocketService.launchStatusResponsesStream().subscribe(response => {
                this.notificationBannerService.notify("Launch Status Posted.");
            });
        }
    }

    /**
     *
     * @param key
     */
    public onEnterKeypress(key: string) : void {
        if (key === "Enter") {
            this.websocketService.emitLaunchStatusCreate(status);
        }
    }
}