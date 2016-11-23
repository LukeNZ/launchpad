import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import moment = require("moment");

@Component({
    selector: 'tmt-datetimeentry',
    template: `
        <div class="entryfield hours">
            <span (click)="increment('hours')">Up</span>
            <input id="{{ id + 'Hour' }}" name="{{ id + 'Hour' }}" #hours="ngModel" [ngModel]="tempDate.getUTCHours()" (ngModelChange)="setDateTimeComponent('hours', $event)" type="text" />
            <span (click)="decrement('hours')">Down</span>
        </div>
        
        <span>:</span>
        
        <div class="entryfield minutes"> 
            <span (click)="increment('minutes')">Up</span>
            <input id="{{ id + 'Minute' }}" name="{{ id + 'Minute' }}" [ngModel]="tempDate.getMinutes()" (ngModelChange)="setDateTimeComponent('minutes', $event)" type="text" />
            <span (click)="decrement('minutes')">Down</span>
        </div>
        
        <span>:</span>
        
        <div class="entryfield seconds"> 
            <span (click)="increment('seconds')">Up</span>
            <input id="{{ id + 'Second' }}" name="{{ id + 'Second' }}" [ngModel]="tempDate.getSeconds()" (ngModelChange)="setDateTimeComponent('seconds', $event)" type="text" />
            <span (click)="decrement('seconds')">Down</span>
        </div>
        
        <div class="entryfield days"> 
            <span (click)="increment('days')">Up</span>
            <input id="{{ id + 'Date' }}" name="{{ id + 'Date' }}" [ngModel]="tempDate.getUTCDate()" (ngModelChange)="setDateTimeComponent('days', $event)" type="text" />
            <span (click)="decrement('days')">Down</span>
        </div>
        
        <div class="entryfield months"> 
            <span (click)="increment('months')">Up</span>
            <input id="{{ id + 'Month' }}" name="{{ id + 'Month' }}" [ngModel]="humanReadableMonth()" (ngModelChange)="setDateTimeComponent('months', $event)" type="text" />
            <span (click)="decrement('months')">Down</span>
        </div>
        
        <div class="entryfield years"> 
            <span (click)="increment('years')">Up</span>
            <input id="{{ id + 'Year' }}" name="{{ id + 'Year' }}" [ngModel]="tempDate.getUTCFullYear()" (ngModelChange)="setDateTimeComponent('years', $event)" type="text" />
            <span (click)="decrement('years')">Down</span>
        </div>
    `
})
/**
 * @class
 * Allows for the entry and discrete adjustment of a date time property in individual components.
 */
export class DateTimeEntryComponent implements OnInit {
    @Input() public id: string;
    @Input() public date: Date;
    @Output() public dateChange: EventEmitter<any> = new EventEmitter();

    public tempDate : Date;

    /**
     * On component initialization, check if the date being passed into the component is undefined.
     * If it is, set the internal component date to now.
     */
    public ngOnInit() : void {
        this.tempDate = this.date == null ? moment().milliseconds(0).toDate() : this.date;
    }

    /**
     * Returns a human readable month string from the current month component of the internal
     * component date.
     *
     * @returns {string} Human readable date string.
     */
    public humanReadableMonth() : string {
        let months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"];

        return months[this.tempDate.getUTCMonth()];
    }

    /**
     * Increments the provided date time component, one of "seconds", "minutes", "hours", "days", "months",
     * or "years" by one.
     *
     * @param dateTimeComponent {string} The component to increment.
     */
    public increment(dateTimeComponent: string) : void {
        this.incrementOrDecrement('+', dateTimeComponent);
    }

    /**
     * Decrements the provided date time component, one of "seconds", "minutes", "hours", "days", "months",
     * or "years" by one.
     *
     * @param dateTimeComponent {string} The component to decrement.
     */
    public decrement(dateTimeComponent: string): void {
        this.incrementOrDecrement('-', dateTimeComponent);
    }

    /**
     * Internal mechanism for incrementing or decrementing a component of a date object. Once the
     * change has occurred, emits an update to the `dateChange` output EventEmitter.
     *
     * @param sign {string} Either '+' or '-', to increment or decrement respectively.
     * @param dateTimeComponent {string} The component to increment or decrement.
     */
    private incrementOrDecrement(sign: string, dateTimeComponent: string) : void {
        let direction = sign === "+" ? 1 : -1;
        switch (dateTimeComponent) {
            case 'years': this.tempDate.setUTCFullYear(this.tempDate.getUTCFullYear() + direction); break;
            case 'months': this.tempDate.setUTCMonth(this.tempDate.getUTCMonth() + direction); break;
            case 'days': this.tempDate.setUTCDate(this.tempDate.getUTCDate() + direction); break;
            case 'hours': this.tempDate.setUTCHours(this.tempDate.getUTCHours() + direction); break;
            case 'minutes': this.tempDate.setMinutes(this.tempDate.getMinutes() + direction); break;
            case 'seconds': this.tempDate.setSeconds(this.tempDate.getSeconds() + direction); break;
        }
        this.dateChange.emit(this.tempDate);
    }

    /**
     * Sets a component of a date object to the specific new value passed through. Once the
     * change has occurred, emits an update to the `dateChange` output EventEmitter.
     *
     * @param dateTimeComponent {string} The component to adjust values for.
     * @param newValue {*} The new value for the component to hold.
     */
    public setDateTimeComponent(dateTimeComponent: string, newValue: any) : void {
        let dynamicMethodNames = {
            'years': "setUTCFullYear",
            'months': "setUTCMonth",
            'days': "setUTCDate",
            'hours': "setUTCHours",
            'minutes': "setMinutes",
            'seconds': "setSeconds"
        };
        this.tempDate[dynamicMethodNames[dateTimeComponent]](newValue);
        this.dateChange.emit(this.tempDate);
    }
}