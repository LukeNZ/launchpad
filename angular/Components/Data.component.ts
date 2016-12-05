import {Component} from "@angular/core";
import {LaunchDataService} from "../Services/LaunchDataService";

@Component({
    selector:'lp-data',
    template: `
        <nav>
            <ul>
                <li>About {{ launchData.launch.name }}</li>
                <li>Incoming Telemetry</li>
                <li>Tweets & Images</li>
            </ul>
            <div>
                <lp-about-tab></lp-about-tab>
                <lp-incoming-telemetry-tab></lp-incoming-telemetry-tab>
                <lp-tweets-images-tab></lp-tweets-images-tab>
            </div>
        </nav>
    `
})
export class DataComponent {
    constructor(public launchData: LaunchDataService) {}
}