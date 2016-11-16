import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {InitializationService} from "../Services/InitializationService";
import {WebsocketService} from "../Services/WebsocketService";
import {AuthService} from "../Services/AuthService";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';


@Component({
    selector:'tmt-home',
    template: `
        <p *ngIf="isLoading">Loading...</p>
        
        <!-- Only show the below contents if the application has loaded. -->
        <template [ngIf]="!isLoading">
        
            <!-- Only show if the application is not active. -->
            <template [ngIf]="!isActive">
            
                <!-- Allow a logged in user to access the application settings to start a launch. -->
                <template [ngIf]="authService.isLoggedIn">
                    <tmt-settings></tmt-settings>
                </template>
                
                <!-- If the application is not active, and the user is a visitor, 
                show the default message. -->
                <template [ngIf]="!authService.isLoggedIn">
                    <p>There is no active launch at this time. Check back soon!</p>
                </template>
            </template>
            
            <!-- Show if the application is active. -->
            <template [ngIf]="isActive">
                <tmt-header></tmt-header>
                <tmt-webcast></tmt-webcast>
                <tmt-statusbar></tmt-statusbar>
                <tmt-updates></tmt-updates>
            </template>  
             
        </template>     
    `
})
/**
 * Where all the fun happens! This is the component that accessible from the route '/', and is the container
 * for most of the application's functionality.
 */
export class HomeComponent implements OnInit {

    public isLoading : boolean = true;
    public isActive : boolean = false;

    constructor(
        public initializationService: InitializationService,
        public authService: AuthService,
        public websocketService: WebsocketService,
        public titleService: Title) {
        this.titleService.setTitle("T Minus Ten");
    }

    /**
     * On component initialization, make three calls to fetch data from the server.
     */
    public ngOnInit() : void {
        Observable.forkJoin(
            this.initializationService.getStatus(),
            this.initializationService.getUpdates(),
            this.initializationService.getWebcasts()
        ).subscribe(data => {
            this.isActive = data[0].isActive;
            this.isLoading = false;
        });
    }
}
