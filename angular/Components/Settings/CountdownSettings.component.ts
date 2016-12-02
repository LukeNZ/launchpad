import {Component, Input} from "@angular/core";
import {Launch} from "../../Interfaces/Launch";
import {LaunchDataService} from "../../Services/LaunchDataService";

@Component({
    selector: `tmt-countdown-settings`,
    template: `
        <h1>Countdown</h1>            
        <form id="countdownForm"></form>
        
            <tmt-datetimeentry id="countdown"
            [date]="launch.countdown" 
            (dateChange)="onCountdownChanged($event)"></tmt-datetimeentry>
            
        <p *ngIf="launchData.launch?.countdown != launch.countdown">New countdown of {{ launch.countdown.toISOString() }}</p>
    `
})
export class CountdownSettingsComponent {
    @Input() public launch: Launch;

    constructor(public launchData: LaunchDataService) {}

    /**
     * Called when the countdown date within the countdowns tab is adjusted. Sets the `countdown` field on the
     * local `launch` property.
     *
     * @param newCountdown {Date} The new temporary countdown value.
     */
    public onCountdownChanged(newCountdown: Date) : void {
        this.launch.countdown = newCountdown;
    }
}