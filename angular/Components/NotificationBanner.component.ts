import {Component} from "@angular/core";

@Component({
    selector: 'tmt-notification-banner',
    template: `
    <div class="notification-banner">
        <p>{{ notification }}</p>
    </div>
    `
})
/**
 * App-wide banner placed at the top of the app that will display a message/notification to the user when it is told
 * to. The banner will calculate how long to display the message based on the message's length.
 */
export class NotificationBannerComponent {

}