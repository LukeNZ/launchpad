import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../Services/AuthService";
import {LaunchDataService} from "../Services/LaunchDataService";

import 'rxjs/add/observable/forkJoin';
import {AppDataService} from "../Services/AppDataService";

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
export class HomeComponent {

    constructor(
        public authData: AuthService,
        public launchData: LaunchDataService,
        public appData: AppDataService,
        public titleService: Title) {
        this.titleService.setTitle("T Minus Ten");
    }
}
