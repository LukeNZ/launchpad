import {Component} from "@angular/core";
import {NotificationBannerService} from "../Services/NotificationBannerService";

@Component({
    selector: 'tmt-notification-banner',
    template: `
    <div class="notification-banner" [style.active]="hasNotification">
        <p>{{ notification }}</p>
    </div>
    `
})
/**
 * App-wide banner placed at the top of the app that will display a message/notification to the user when it is told
 * to. The banner will calculate how long to display the message based on the message's length.
 */
export class NotificationBannerComponent {
    public readonly WORDS_PER_SECOND = 200 / 60;

    public hasNotification: boolean = false;
    public notification : string = "";

    constructor(public notificationBannerService: NotificationBannerService) {
        notificationBannerService.notifications.subscribe(message => {
            this.hasNotification = true;
            this.notification = message;

            let defaultTime = 2000;
            let excessTime = Math.round((message.split(" ").length / this.WORDS_PER_SECOND) * 1000);

            window.setTimeout(() => {
                this.hasNotification = false;
                this.notification = "";
            }, defaultTime + excessTime);
        });
    }
}