import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {InitializationService} from "../Services/InitializationService";
import {WebsocketService} from "../Services/WebsocketService";
import {AuthService} from "../Services/AuthService";
import {LaunchDataService} from "../Services/LaunchDataService";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {AppDataService} from "../Services/AppDataService";

@Component({
    selector:'tmt-home',
    template: `
        <p *ngIf="isLoading">Loading...</p>
        
        <!-- Only show the below contents if the application has loaded. -->
        <ng-container *ngIf="!isLoading">
        
            <!-- Allow a logged in user to access the application settings to start a launch,
             allow a logged in user to edit the launch, allow a general user to set their personal 
             preferences. -->
            <tmt-settings 
            *ngIf="(authService.isLoggedIn && !appData.isActive) || appData.isActive" 
            [hidden]="!appData.isSettingsVisible"></tmt-settings>
                
        
            <!-- Only show if the application is not active. -->
            <ng-container *ngIf="!appData.isActive">
            
                <!-- If the application is not active, and the user is a visitor, 
                show the default message. -->
                <ng-container *ngIf="!authService.isLoggedIn">
                    <p>There is no active launch at this time. Check back soon!</p>
                </ng-container>
            </ng-container>
            
            <!-- Show if the application is active. -->
            <ng-container *ngIf="appData.isActive">
                <tmt-header></tmt-header>
                <tmt-livestream></tmt-livestream>
                <tmt-statusbar></tmt-statusbar>
                <tmt-updates></tmt-updates>
            </ng-container>  
             
        </ng-container>     
    `
})
/**
 * Where all the fun happens! This is the component that accessible from the route '/', and is the container
 * for most of the application's functionality.
 * @class
 */
export class HomeComponent implements OnInit {

    public isLoading : boolean = true;

    constructor(
        public initializationService: InitializationService,
        public authService: AuthService,
        public websocketService: WebsocketService,
        public launchData: LaunchDataService,
        public appData: AppDataService,
        public titleService: Title) {
        this.titleService.setTitle("T Minus Ten");
    }

    /**
     * On component initialization, make three calls to fetch data from the server, so we are
     * up to date with respect to the current application's state.
     */
    public ngOnInit() : void {
        Observable.forkJoin(
            this.initializationService.getLaunch(),
            this.initializationService.getStatuses(),
            this.initializationService.getTMinusTen()
        ).subscribe(data => {
            this.launchData.setLaunch(data[0]);
            this.launchData.setStatuses(data[1]);
            this.appData.isActive = data[2].isActive;

            if (!this.appData.isActive) {
                this.appData.isSettingsVisible = true;
            }

            console.log("Launch Data from Home:");
            console.log(this.launchData);

            this.isLoading = false;
        });
    }
}
