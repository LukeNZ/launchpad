import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {TMinusTenService} from "../Services/TMinusTenService";
import {WebsocketService} from "../Services/WebsocketService";

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/forkJoin';

@Component({
    selector:'tmt-home',
    template: `
        <template [ngIf]="isActive">
            <tmt-header></tmt-header>
            <tmt-webcast></tmt-webcast>
            <tmt-statusbar></tmt-statusbar>
            <tmt-updates></tmt-updates>
        </template>
        <p *ngIf="!isActive && !isLoading">There's no current launch at this time.</p>
    `
})
export class HomeComponent implements OnInit {

    public isLoading : boolean = true;
    public isActive : boolean = false;

    constructor(
        public tMinusTenService: TMinusTenService,
        public websocketService: WebsocketService,
        public titleService: Title) {
        this.titleService.setTitle("T Minus Ten");
    }

    /**
     *
     */
    public ngOnInit() : void {
        Observable.forkJoin(
            this.tMinusTenService.getStatus(),
            this.tMinusTenService.getUpdates(),
            this.tMinusTenService.getWebcasts()
        ).subscribe(data => {
            this.isActive = data[0].isActive;
            this.isLoading = false;
        });
    }
}
