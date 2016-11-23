import {Component} from "@angular/core";
import {AppDataService} from "../Services/AppDataService";

@Component({
    selector:'tmt-header',
    template: `
        <div class="header-area">
            <tmt-countdown></tmt-countdown>
            <i (click)="appData.isSettingsVisible = true">Settings</i>
        </div>       
    `
})
export class HeaderComponent {
    constructor(public appData: AppDataService) {}
}