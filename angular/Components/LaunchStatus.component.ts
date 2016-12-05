import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from "@angular/core";
import {Status} from "../Interfaces/Status";
import {CountdownComponentCalculator} from "../Services/CountdownComponentCalculator";
var moment = require("moment-timezone");
var jstz = require('jstimezonedetect');

@Component({
    selector: 'lp-launch-status',
    template: `
        <div class="launch-status-info">
            <span></span>
            <span>{{ relativeTimeToLaunch() }}</span>
            <span>({{ relativeTime() }})</span>
            <span>{{ formattedLocalTime() }}</span>
        </div>
        <div class="launch-status-content">
            <p>{{ launchStatus.text | acronyms }}</p>
            
            <ul class="launch-status-tools" *ngIf="">
                <li class="request-edit">Request Edit</li>
                <li class="delete">Delete</li>
            </ul>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * @class
 */
export class LaunchStatusComponent {
    @Input() public launchStatus: Status;
    @Output() public onEditRequest: EventEmitter<string> = new EventEmitter<string>();
    @Output() public onEdit: EventEmitter<string> = new EventEmitter<string>();
    @Output() public onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _relativeTimeToLaunch: string;
    private _relativeTime: string;
    private _formattedLocalTime: string;

    constructor() {}

    /**
     * Returns a string of the relative time difference to the launch. For simplification reasons,
     * only the first two components of the relative time difference are displayed, i.e. `T-6d 4h` or
     * `T-8s`.
     *
     * @returns {string} A string showing the relative time to T-0.
     */
    public relativeTimeToLaunch() : string {
        if (this._relativeTimeToLaunch) {
            return this._relativeTimeToLaunch;
        }

        let difference = moment(this.launchStatus.countdown).diff(this.launchStatus.timestamp, 'seconds');
        let components = CountdownComponentCalculator.calculate(difference);

        let appends = 0;
        let outputString = (difference <= 0 ? 'T-' : 'T+') + Object.keys(components).reduce((acc, v) => {
            if ((appends === 0 && components[v] !== 0) || appends === 1) {
                appends++;
                return acc + components[v] + v[0] + " ";
            }
            return acc;
        }, "").trim();

        this._relativeTimeToLaunch = outputString;
        return outputString;
    }

    public relativeTime() : string {
        if (this._relativeTime) {
            return this._relativeTime;
        }
    }

    public formattedLocalTime() : string {
        if (this._formattedLocalTime) {
            return this._formattedLocalTime;
        }

        this._formattedLocalTime = moment(this.launchStatus.timestamp)
            .tz(jstz.determine().name()).format('h:mmA D MMMM z');

        return this._formattedLocalTime;
    }

}