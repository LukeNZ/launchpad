import {Component, OnInit} from "@angular/core";
import {WebsocketService} from "../Services/WebsocketService";
import {NotificationBannerService} from "../Services/NotificationBannerService";
import {LaunchDataService} from "../Services/LaunchDataService";
import {Launch} from "../Classes/Launch";
import {DescriptionSection} from "../Interfaces/DescriptionSection";
import {Resource} from "../Interfaces/Resource";
import {AppDataService} from "../Services/AppDataService";
import {MomentTemplate} from "../Interfaces/MomentTemplate";
import {AuthService} from "../Services/AuthService";

enum SettingsSection {
    Display, Notifications, GeneralSetup, Countdown, Introduction,
    DescriptionSections, Resources, LaunchMomentTemplates, About
}

@Component({
    selector:'tmt-settings',
    template: `
        <i [hidden]="!appData.isActive" (click)="appData.isSettingsVisible = false">Close</i>
        <nav id="settings-nav">
            <ul>
                <li (click)="setCurrentSection(settings.Display)">
                    Display
                </li>
                <li (click)="setsetCurrentSection(settings.Notifications">
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
                    <bulb [state]="hasSeen(settings.LaunchMomentTemplates)"></bulb> Launch Moment Templates
                </li>
                <li (click)="setCurrentSection(settings.About)">
                    About the App
                </li>
            </ul>
        </nav>
        
        <!-- DISPLAY -->
        <section [hidden]="currentSection != settings.Display">
            <h1>Display</h1>
            
            <p>Increase text size</p>
            <p>Density settings</p>
            <p>Disable Acronyms</p>
            <p>Nightmode</p>
            
            <div>Example of launch status here</div>
        </section>
        
        <!-- NOTIFICATIONS -->
        <section [hidden]="currentSection != settings.Notifications">
            <h1>Notifications</h1>
            
            <p>Play ping when a new update arrives when tab inactive</p>
        </section>
        
        <!-- GENERAL SETUP -->
        <section [hidden]="currentSection != settings.GeneralSetup" *ngIf="!appData.isActive && authData.isLoggedIn">
            <h1>General Setup</h1>
            <p>General launch setup details and specific application settings.</p>
            
            <h2>Launch Name</h2>
            <p *ngIf="launch.name">Will appear on Reddit as: <span class="title">r/SpaceX {{ launch.name }} Official Launch Discussion & Updates Thread</span></p>
            <form>
                <label for="mission">Mission Name</label>
                <input type="text" name="mission" [(ngModel)]="launch.name" placeholder="Mission Name">
            </form>
            
            <h2>Livestreams</h2>
            
        </section>
        
        <!-- COUNTDOWN -->
        <section [hidden]="currentSection != settings.Countdown" *ngIf="authData.isLoggedIn">
            <h1>Countdown</h1>
            
            <form>
                <tmt-datetimeentry [id]="'countdown'" [date]="launch.countdown" (dateChange)="onCountdownChanged($event)"></tmt-datetimeentry>
            </form>
            
            <p *ngIf="launchData.launch?.countdown != launch.countdown">New countdown of {{ launch.countdown.toISOString() }}</p>
        </section>
        
        <!-- INTRODUCTION -->
        <section [hidden]="currentSection != settings.Introduction" *ngIf="authData.isLoggedIn">
            <h1>Introduction</h1>
            <form>
                <textarea name="introduction" [(ngModel)]="launch.introduction" placeholder="Introductory paragraph about the launch."></textarea>
                <span>{{ launch.introduction?.length }} + characters.</span>
            </form>
        </section>
        
        <!-- DESCRIPTION SECTIONS -->
        <section [hidden]="currentSection != settings.DescriptionSections" *ngIf="authData.isLoggedIn">
            <h1>Description Sections</h1>
            
            <button (click)="addDescriptionSection()">Add Section</button>
            
            <ng-container *ngFor="let section of launch.descriptionSections">
                <input type="text" placeholder="Section title" [(ngModel)]="section.title" />
                <textarea placeholder="Section description" [(ngModel)]="section.description" ></textarea>
                <button (click)="removeDescriptionSection(section)">Remove</button>
            </ng-container>
        </section>
        
        <!-- RESOURCES -->
        <section [hidden]="currentSection != settings.Resources" *ngIf="authData.isLoggedIn">
            <h1>Resources</h1>
            
            <button (click)="addResource()">Add Resource</button>
            
            <ng-container *ngFor="let resource of launch.resources">
                <input type="text" placeholder="Resource Title" [(ngModel)]="resource.title" />
                <input type="text" placeholder="Resource URL" [(ngModel)]="resource.url" />
                <input type="text" placeholder="Resource Note" [(ngModel)]="resource.note" />          
                <button (click)="removeResource(resource)">Remove</button>
            </ng-container>
        </section>
        
        <!-- LAUNCH MOMENT TEMPLATES -->
        <section [hidden]="currentSection != settings.LaunchMomentTemplates" *ngIf="authData.isLoggedIn">
            <h1>Launch Moment Templates</h1>
            
            <ng-container *ngFor="let momentTemplate of launchMomentTemplates">
                <p>{{ momentTemplate[1].title }}</p>
                <textarea>{{ momentTemplate[1].text }}</textarea>
            </ng-container>
            <button>Save</button>
        </section>
        
        <!-- ABOUT -->
        <section [hidden]="currentSection != settings.About">
            <h1>About the App</h1>
            <p>Written by Luke. View on GitHub here: https://github.com/LukeNZ/tminusten.</p>
        </section>
        
        <!-- LIFTOFF OPTIONS -->
        <div *ngIf="!appData.isActive && authData.isLoggedIn">
            <button (click)="liftoff()" [disabled]="settingsState.isLiftingOff">
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
    public launchMomentTemplates: [string, MomentTemplate][];

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
        this.setDefaultSettingPane();

        this.launchData.launchObservable().subscribe(data => {
            this.launch = Object.assign({}, data);
        });

        this.launchMomentTemplates = Array.from(this.appData.launchMomentTemplates);

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
    private setDefaultSettingPane() {
        if (this.authData.isLoggedIn && !this.appData.isActive) {
            this.currentSection = this.settings.GeneralSetup;
        } else {
            this.currentSection = this.settings.Display;
        }
    }

    public setCurrentSection(section: SettingsSection) {
        this.currentSection = section;
        this.settingsState.seenSections.push(section);
    }

    /**
     *
     * @param section
     * 
     * @returns {boolean}
     */
    public hasSeen(section) {
        return this.settingsState.seenSections.indexOf(section) !== -1;
    }

    /**
     * Functionality to activate the T Minus Ten app. Is called by clicking the `launch` button from within the settings
     * menu. Emits an `appStatus` to the server of type "enableApp".
     */
    public liftoff(): void {
        let data = {
            name: this.launch.name,
            countdown: this.launch.countdown.toISOString(),
            introduction: this.launch.introduction,
            resources: this.launch.resources,
            descriptionSections: this.launch.descriptionSections
        };

        this.settingsState.isLiftingOff = true;

        this.websocketService.emitAppStatus("enableApp", data);
    }

    /**
     * Called when the countdown date within the countdowns tab is adjusted. Sets the `countdown` field on the
     * local `launch` property.
     *
     * @param newCountdown {Date} The new temporary countdown value.
     */
    public onCountdownChanged(newCountdown: Date) : void {
        this.launch.countdown = newCountdown;
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