import {Component, ElementRef, OnInit, Input} from "@angular/core";
import {AppDataService} from "../Services/AppDataService";

@Component({
    selector: 'bulb',
    template: ``
})
export class BulbComponent implements OnInit {
    public _state: boolean; // have to make this an obvervable?

    constructor(public elementRef: ElementRef, public appData: AppDataService) {}

    public ngOnInit() : void {
        this.elementRef.nativeElement.classList.add('bulb-enabled');
    }

    @Input()
    set state(value: boolean) {
        this._state = value;

        if (this._state) {
            this.elementRef.nativeElement.classList.remove('bulb-enabled');
        }
    }

    get state() : boolean {
        return this._state;
    }
}