import {Component} from "@angular/core";
import {AuthService} from "../Services/AuthService";
import {NotificationBannerService} from "../Services/NotificationBannerService";
import {LaunchDataService} from "../Services/LaunchDataService";

@Component({
    selector:'body',
    template: `
        <tmt-notification-banner></tmt-notification-banner>
        <router-outlet></router-outlet>
    `
})
/**
 * @class
 * Global application component. Instantiate authService here to ensure the same instance is globally available across
 * all child components. Also holds the notification banner to display app wide information.
 */
export class TMinusTenComponent {

    /**
     * Construct globally available services.
     *
     * @param authService
     * @param notificationBannerService
     * @param launchDataService
     */
    constructor(
        public authService: AuthService,
        public notificationBannerService: NotificationBannerService,
        public launchDataService: LaunchDataService) {}
}