import {Component} from "@angular/core";
import {AuthService} from "../Services/AuthService";

@Component({
    selector:'body',
    template: `
        <tmt-notification-banner></tmt-notification-banner>
        <router-outlet></router-outlet>
    `
})
/**
 * Global application component. Instantiate authService here to ensure the same instance is globally available across
 * all child components. Also holds the notification banner to display app wide information.
 */
export class TMinusTenComponent {
    constructor(public authService: AuthService) {}
}