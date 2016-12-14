import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {Status} from "../Interfaces/Status";
import {CountdownComponentCalculator} from "../Services/CountdownComponentCalculator";
import {AuthService} from "../Services/AuthService";
const moment = require("moment-timezone");
const jstz = require('jstimezonedetect');

/**
 * @class
 */
@Component({
    selector: 'lp-launch-status',
    template: `
        <div class="launch-status-info">
            <span></span>
            <span>{{ relativeTimeToLaunch() }}</span>
            <span>({{ relativeTime }})</span>
            <span>{{ formattedLocalTime() }}</span>
        </div>
        <div class="launch-status-content">
            <p>{{ launchStatus.text | acronyms }}</p>
            
            <ul class="launch-status-tools">
                <li class="request-edit" (click)="onEditRequest.emit(launchStatus.statusId)"
                *ngIf="authData.hasPrivilegesPermission">Request Edit</li>
                <li class="delete" (click)="onDelete.emit(launchStatus.statusId)" 
                *ngIf="authData.hasModeratorPermission">Delete</li>
            </ul>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchStatusComponent implements OnInit, OnDestroy {
    @Input() public launchStatus: Status;
    @Output() public onEditRequest: EventEmitter<string> = new EventEmitter<string>();
    @Output() public onEdit: EventEmitter<number> = new EventEmitter<number>();
    @Output() public onDelete: EventEmitter<number> = new EventEmitter<number>();

    private _relativeTimeToLaunch: string;
    private _formattedLocalTime: string;
    public relativeTime: string;

    private _refreshIntervalId: number;

    constructor(private changeDetectorRef: ChangeDetectorRef, public authData: AuthService) {
    }

    /**
     * On component initialization, we need to set the relative time, then set a timer to recheck the relative time
     * every
     */
    public ngOnInit() : void {
        this.setRelativeTime();
        this._refreshIntervalId = window.setInterval(() => {
            this.setRelativeTime();
        }, 5000);
    }

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

        let duration = moment(this.launchStatus.countdown).diff(this.launchStatus.timestamp, 'seconds');
        let components = CountdownComponentCalculator.calculate(duration);

        let appends = 0;
        let outputString = (duration <= 0 ? 'T+' : 'T-') + Object.keys(components).reduce((acc, v) => {
            if ((appends === 0 && components[v] !== 0) || appends === 1) {
                appends++;
                return acc + components[v] + v[0] + " ";
            }
            return acc;
        }, "").trim();

        this._relativeTimeToLaunch = outputString;
        return outputString;
    }

    /**
     * Return a humanized duration representing the time and date since the launch status was created.
     *
     * @returns {string} A humanized duration showing how long it has been since the status was created.
     */
    public setRelativeTime() : void {
        this.relativeTime = moment(this.launchStatus.timestamp).from(moment());
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Returns a string representing the time and date relative to the user's current location for the current
     * update timestamp. Format includes timezone and AM/PM.
     *
     * @returns {string} A string showing the local time for the user.
     */
    public formattedLocalTime() : string {
        if (this._formattedLocalTime) {
            return this._formattedLocalTime;
        }

        this._formattedLocalTime = moment(this.launchStatus.timestamp)
            .tz(jstz.determine().name()).format('h:mmA D MMMM z');

        return this._formattedLocalTime;
    }

    /**
     * When this component is destroyed, remove the refresh interval timer with it.
     */
    public ngOnDestroy() : void {
        window.clearInterval(this._refreshIntervalId);
    }
}