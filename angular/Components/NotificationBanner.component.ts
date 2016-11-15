import {Component} from "@angular/core";

@Component({
    selector: 'tmt-notification-banner',
    template: `
    <div class="notification-banner">
        <p>{{ notification }}</p>
    </div>
    `
})
export class NotificationBannerComponent {

}