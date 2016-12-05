import {Component, OnInit} from "@angular/core";
import {WebsocketService} from "../Services/WebsocketService";
import {NotificationBannerService} from "../Services/NotificationBannerService";
import {LaunchDataService} from "../Services/LaunchDataService";
import {Launch} from "../Interfaces/Launch";
import {DescriptionSection} from "../Interfaces/DescriptionSection";
import {Resource} from "../Interfaces/Resource";
import {AppDataService} from "../Services/AppDataService";
import {MomentTemplate} from "../Interfaces/MomentTemplate";
import {AuthService} from "../Services/AuthService";
import {Livestream} from "../Interfaces/Livestream";


enum SettingsSection {
    Display, Notifications, GeneralSetup, Countdown, Introduction,
    DescriptionSections, Resources, LaunchMomentTemplates, About
}

@Component({
    selector:'lp-settings',
    template: `
        <i [hidden]="!appData.isActive" (click)="appData.isSettingsVisible = false">Close</i>
        <nav id="settings-nav">
            <ul>
                <li (click)="setCurrentSection(settings.Display)">
                    Display
                </li>
                <li (click)="setCurrentSection(settings.Notifications)">
                    Notifications
                </li>
                <li (click)="setCurrentSection(settings.GeneralSetup)" *ngIf="!appData.isActive && authData.isLoggedIn">
                    <bulb [state]="hasSeen(settings.GeneralSetup)"></bulb> General Setup
                </li>
                <li (click)="setCurrentSection(settings.Countdown)" *ngIf="authData.isLoggedIn">
                    <bulb [state]="hasSeen(settings.Countdown)"></bulb> Countdown
                </li>
                <li (click)="setCurrentSection(settings.Introduction)" *ngIf="authData.isLoggedIn">
                    <bulb [state]="hasSeen(settings.Introduction)"></bulb> Introduction
                </li>
                <li (click)="setCurrentSection(settings.DescriptionSections)" *ngIf="authData.isLoggedIn">
                    <bulb [state]="hasSeen(settings.DescriptionSections)"></bulb> Description Sections
                </li>
                <li (click)="setCurrentSection(settings.Resources)" *ngIf="authData.isLoggedIn">
                    <bulb [state]="hasSeen(settings.Resources)"></bulb> Resources
                </li>
                <li (click)="setCurrentSection(settings.LaunchMomentTemplates)" *ngIf="authData.isLoggedIn">
                    Launch Moment Templates
                </li>
                <li (click)="setCurrentSection(settings.About)">
                    About the App
                </li>
            </ul>
        </nav>
        
        <!-- DISPLAY -->
        <lp-display-settings [hidden]="currentSection != settings.Display"></lp-display-settings>
        
        <!-- NOTIFICATIONS -->
        <lp-notification-settings [hidden]="currentSection != settings.Notifications"></lp-notification-settings>
        
        <!-- GENERAL SETUP -->
        <lp-general-setup-settings [hidden]="currentSection != settings.GeneralSetup" 
        [launch]="launch" [livestreams]="livestreams"
        *ngIf="!appData.isActive && authData.isLoggedIn"></lp-general-setup-settings>
        
        <!-- COUNTDOWN -->
        <lp-countdown-settings [hidden]="currentSection != settings.Countdown" 
        [launch]="launch" *ngIf="authData.isLoggedIn"></lp-countdown-settings>
        
                <!-- INTRODUCTION -->
        <lp-introduction-settings [hidden]="currentSection != settings.Introduction" 
        [launch]="launch" *ngIf="authData.isLoggedIn"></lp-introduction-settings>
        
        <!-- DESCRIPTION SECTIONS -->
        <lp-description-sections-settings [hidden]="currentSection != settings.DescriptionSections" 
        [launch]="launch" *ngIf="authData.isLoggedIn"></lp-description-sections-settings>
        
        <!-- RESOURCES -->
        <lp-resources-settings [hidden]="currentSection != settings.Resources" 
        [launch]="launch" *ngIf="authData.isLoggedIn"></lp-resources-settings>
        
        <!-- LAUNCH MOMENT TEMPLATES -->
        <lp-launch-moment-templates-settings [hidden]="currentSection != settings.LaunchMomentTemplates" 
        [launchMomentTemplates]="launchMomentTemplates" *ngIf="authData.isLoggedIn"></lp-launch-moment-templates-settings>
    
        <!-- ABOUT -->
        <lp-about-settings [hidden]="currentSection != settings.About"></lp-about-settings>

        <!-- LIFTOFF OPTIONS -->
        <div *ngIf="!appData.isActive && authData.isLoggedIn">
        
            <form id="liftoffForm"></form>
        
            <button form="liftoffForm" (click)="liftoff()" [disabled]="settingsState.isLiftingOff">
                {{ settingsState.isLiftingOff ? "Lifting off..." : "Liftoff" }}
            </button>
        </div>
    `
})
/**
 * Settings. Appears as an overlaid window within the application either if no launch is actively running, or if the cog
 * settings icon is clicked. From here, changes to the description, title, webcasts, and other functionality can be made.
 * @class
 */
export class SettingsComponent implements OnInit {

    public settings = SettingsSection;
    public currentSection: SettingsSection;

    public launch: Launch;
    public livestreams : Livestream[] = [];
    public launchMomentTemplates: MomentTemplate[];

    public settingsState = {
        isLiftingOff: false,
        isSaving: false,
        seenSections: []
    };

    constructor(
        public websocketService : WebsocketService,
        public notificationBannerService: NotificationBannerService,
        public launchData: LaunchDataService,
        public appData: AppDataService,
        public authData: AuthService
    ) {}

    /**
     * On component initialization, set the current setting section page, and
     */
    public ngOnInit() : void {
        this.registerDefaultSettingsSection();

        this.launchData.launchObservable().subscribe(data => {
            this.launch = Object.assign({}, data);
        });

        this.launchMomentTemplates = Array.from(this.appData.launchMomentTemplates);
        this.livestreams = Array.from(this.appData.livestreams);

        this.websocketService.appStatusResponsesStream().subscribe(response => {
            if (response.response.type === "enableApp") {
                this.settingsState.isLiftingOff = false;

                if (response.responseCode === 200) {
                    this.notificationBannerService.notify("App Enabled.");
                } else {
                    this.notificationBannerService.notify("Looks like something went wrong.");
                }
            }
        });
    }

    /**
     * Called by ngOnInit, sets the default setting section based on whether you're logged into
     * the app or not, and if the application is running.
     */
    private registerDefaultSettingsSection() {
        if (this.authData.isLoggedIn && !this.appData.isActive) {
            this.currentSection = this.settings.GeneralSetup;
        } else {
            this.currentSection = this.settings.Display;
        }
    }

    /**
     * Sets the current settings section pane of the Settings component.
     *
     * @param section {SettingsSection} the section to set as current.
     */
    public setCurrentSection(section: SettingsSection) {
        this.currentSection = section;
        this.settingsState.seenSections.push(section);
    }

    /**
     * Checks whether the provided section has been viewed at least once.
     *
     * @param section {SettingsSection} The section to query.
     * 
     * @returns {boolean} Whether the section has been seen.
     */
    public hasSeen(section: SettingsSection) {
        return this.settingsState.seenSections.indexOf(section) !== -1;
    }

    /**
     * Functionality to activate the T Minus Ten app. Is called by clicking the `launch` button from within the settings
     * menu. Emits an `appStatus` to the server of type "enableApp".
     */
    public liftoff(): void {

        console.log(this.launch);
        console.log(this.livestreams);

        this.settingsState.isLiftingOff = true;
        this.websocketService.emitAppStatus("enableApp", this.launch);
    }

    /**
     * Adds a description section to the array of description sections.
     */
    public addDescriptionSection() : void {
        let descriptionSection: DescriptionSection = {
            title: null,
            description: null
        };

        if (!this.launch.descriptionSections) {
            this.launch.descriptionSections = [];
        }

        this.launch.descriptionSections.push(descriptionSection);
    }

    /**
     * Removes the given description section from the description sections array.
     *
     * @param descriptionSection {DescriptionSection} The section to remove.
     */
    public removeDescriptionSection(descriptionSection: DescriptionSection) : void {
        let index = this.launch.descriptionSections.indexOf(descriptionSection);
        this.launch.descriptionSections.splice(index, 1);
    }

    /**
     * Adds a resource to the array of resources.
     */
    public addResource() : void {
        let resource: Resource = {
            title: null,
            url: null,
            note: null
        };

        if (!this.launch.resources) {
            this.launch.resources = [];
        }

        this.launch.resources.push(resource);
    }

    /**
     * Removes the given resource from the resources array.
     *
     * @param resource {Resource} The resource to remove.
     */
    public removeResource(resource: Resource) : void {
        let index = this.launch.resources.indexOf(resource);
        this.launch.resources.splice(index, 1);
    }
}