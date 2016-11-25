import {Component, Input} from "@angular/core";
import {Status} from "../Interfaces/Status";

@Component({
    selector: 'tmt-launch-status',
    template: `
        <div><p>{{ launchStatus.text }}</p></div>
    `
})
export class LaunchStatusComponent {
    @Input() public launchStatus: Status;

    constructor() {}
}