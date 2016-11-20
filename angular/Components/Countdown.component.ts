import {Component, Input, OnInit} from "@angular/core";
import {LaunchDataService} from "../Services/LaunchDataService";

@Component({
    selector:'tmt-countdown',
    template: `
        <table class="countdown">
            <tr *ngIf="!launchData.launch.isPaused">
                <td>T{{ sign }}</td>
                <td>{{ days }}<small>d</small></td>
                <td>{{ hours }}<small>h</small></td>
                <td>{{ minutes }}<small>m</small></td>
                <td>{{ seconds }}<small>s</small></td>
            </tr>
            <tr *ngIf="launchData.launch.isPaused">
                <td>Paused</td>
            </tr>
        </table>
    `
})
export class CountdownComponent implements OnInit {
    @Input() public callback: Function;

    public sign: string;
    public days: number;
    public hours: number;
    public minutes: number;
    public seconds: number;

    constructor(public launchData: LaunchDataService) {}

    public ngOnInit() : void {
        setInterval(this.countdownProcessor(), 1000);
    }

    /**
     *
     */
    public countdownProcessor() : void {
        if (!this.launchData.launch.isPaused) {
            let relativeSecondsBetween = (((+new Date()) - +this.launchData.launch.countdown) / 1000);
            let secondsBetween = Math.abs(relativeSecondsBetween);

            this.sign = relativeSecondsBetween <= 0 ? '-' : '+';

            this.days = Math.floor(secondsBetween / (60 * 60 * 24));
            secondsBetween -= this.days * 60 * 60 * 24;

            this.hours = Math.floor(secondsBetween / (60 * 60));
            secondsBetween -= this.hours * 60 * 60;

            this.minutes = Math.floor(secondsBetween / 60);
            secondsBetween -= this.minutes * 60;

            this.seconds = secondsBetween;

            if (typeof this.callback === "function") {
                this.callback(relativeSecondsBetween);
            }
        }
    }
}