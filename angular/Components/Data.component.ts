import {Component} from "@angular/core";
import {LaunchDataService} from "../Services/LaunchDataService";

@Component({
    selector:'tmt-data',
    template: `
        <nav>
            <ul>
                <li>About {{ launchData.launch.name }}</li>
                <li>Incoming Telemetry</li>
                <li>Tweets & Images</li>
            </ul>
            <div>
                <tmt-about-tab></tmt-about-tab>
                <tmt-incoming-telemetry-tab></tmt-incoming-telemetry-tab>
                <tmt-tweets-images-tab></tmt-tweets-images-tab>
            </div>
        </nav>
    `
})
export class DataComponent {
    constructor(public launchData: LaunchDataService) {}
}