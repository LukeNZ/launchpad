import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../Services/AuthService";
import {LaunchDataService} from "../Services/LaunchDataService";
import {AppDataService} from "../Services/AppDataService";
import {InitializationService} from "../Services/InitializationService";

import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

@Component({
    selector:'tmt-home',
    template: `
        <p *ngIf="appData.isLoading">Loading...</p>
        
        <!-- Only show the below contents if the application has loaded. -->
        <ng-container *ngIf="!appData.isLoading">
        
            <!-- Allow a logged in user to access the application settings to start a launch,
             allow a logged in user to edit the launch, allow a general user to set their personal 
             preferences. -->
            <tmt-settings 
            *ngIf="(authData.isLoggedIn && !appData.isActive) || appData.isActive" 
            [hidden]="!appData.isSettingsVisible"></tmt-settings>
                
        
            <!-- Only show if the application is not active. -->
            <ng-container *ngIf="!appData.isActive">
            
                <!-- If the application is not active, and the user is a visitor, 
                show the default message. -->
                <ng-container *ngIf="!authData.isLoggedIn">
                    <p>There is no active launch at this time. Check back soon!</p>
                </ng-container>
            </ng-container>
            
            <!-- Show if the application is active. -->
            <ng-container *ngIf="appData.isActive">
                <tmt-header></tmt-header>
                <tmt-livestream></tmt-livestream>
                <tmt-statusbar></tmt-statusbar>
                <tmt-data></tmt-data>
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

    constructor(
        public authData: AuthService,
        public launchData: LaunchDataService,
        public appData: AppDataService,
        public initializationService: InitializationService,
        public titleService: Title) {}

    /**
     *
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
            this.appData.launchMomentTemplates = data[2].launchMomentTemplates;
            this.appData.livestreams = data[2].livestreams;

            if (!this.appData.isActive) { this.appData.isSettingsVisible = true; }
            this.appData.isLoading = false;
        });

        this.titleService.setTitle("T Minus Ten");


    }
}
