import {Component, Input, OnInit} from "@angular/core";
import {LaunchDataService} from "../Services/LaunchDataService";
import {CountdownComponentCalculator} from "../Services/CountdownComponentCalculator";
import {CountdownComponents} from "../Interfaces/CountdownComponents";
var moment = require("moment-timezone");

@Component({
    selector:'lp-countdown',
    template: `
        <table class="countdown">
            <tr *ngIf="!launchData.launch.isPaused">
                <td>T{{ sign }}</td>
                <td>{{ components.days }}<small>d</small></td>
                <td>{{ components.hours }}<small>h</small></td>
                <td>{{ components.minutes }}<small>m</small></td>
                <td>{{ components.seconds }}<small>s</small></td>
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
    public components: CountdownComponents = { days: 0, hours: 0, minutes: 0, seconds: 0};

    constructor(public launchData: LaunchDataService) {}

    /**
     * Runs the countdown processor.
     */
    public ngOnInit() : void {
        setInterval(this.countdownProcessor.bind(this), 1000);
    }

    /**
     * Process the countdown, calculating the components of the countdown based on how many seconds currently
     * remain before the launch time is reached.
     */
    public countdownProcessor() : void {

        if (!this.launchData.launch.isPaused) {
            let relativeSecondsBetween = ((+(moment().milliseconds(0).toDate()) - +this.launchData.launch.countdown) / 1000);
            this.sign = relativeSecondsBetween <= 0 ? '-' : '+';
            this.components = CountdownComponentCalculator.calculate(Math.abs(relativeSecondsBetween));

            if (typeof this.callback === "function") {
                this.callback(relativeSecondsBetween);
            }
        }
    }
}