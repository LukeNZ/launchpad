import {Component, OnInit} from "@angular/core";
import {WebsocketService} from "../Services/WebsocketService";
import {NotificationBannerService} from "../Services/NotificationBannerService";
import {LaunchDataService} from "../Services/LaunchDataService";
import {Launch} from "../Classes/Launch";
import {DescriptionSection} from "../Interfaces/DescriptionSection";
import {Resource} from "../Interfaces/Resource";
import {AppDataService} from "../Services/AppDataService";

enum SettingsSection {
    Display, Notifications, General, Countdown, Introduction,
    DescriptionSections, Resources, LaunchEventTemplates, About
}

@Component({
    selector:'tmt-settings',
    template: `
        <i [hidden]="!appData.isActive" (click)="appData.isSettingsVisible = false">Close</i>
        <div>
            <nav>
                <ul>
                    <li (click)="currentSection = settingsSection.Display">Display</li>
                    <li (click)="currentSection = settingsSection.Notifications">Notifications</li>
                    <li (click)="currentSection = settingsSection.General">General</li>
                    <li (click)="currentSection = settingsSection.Countdown">Countdown</li>
                    <li (click)="currentSection = settingsSection.Introduction">Introduction</li>
                    <li (click)="currentSection = settingsSection.DescriptionSections">Description Sections</li>
                    <li (click)="currentSection = settingsSection.Resources">Resources</li>
                    <li (click)="currentSection = settingsSection.LaunchEventTemplates">Launch Event Templates</li>
                    <li (click)="currentSection = settingsSection.About">About the App</li>
                </ul>
            </nav>
            
            <!-- DISPLAY -->
            <section [hidden]="currentSection != settingsSection.Display">
                <h1>Display</h1>
                
                <p>Increase text size</p>
                <p>Density settings</p>
            </section>
            
            <!-- NOTIFICATIONS -->
            <section [hidden]="currentSection != settingsSection.Notifications">
                <h1>Notifications</h1>
                
                <p>Play ping when a new update arrives when tab inactive</p>
            </section>
            
            <!-- GENERAL -->
            <section [hidden]="currentSection != settingsSection.General">
                <h1>General</h1>
                <p>General launch details and application settings.</p>
                
                <p *ngIf="launch.name">Will appear on Reddit as: <span class="title">r/SpaceX {{ launch.name }} Official Launch Discussion & Updates Thread</span></p>
                <form>
                    <label for="mission">Mission Name</label>
                    <input type="text" name="mission" [(ngModel)]="launch.name" placeholder="Mission Name">
                </form>
            </section>
            
            <!-- COUNTDOWN -->
            <section [hidden]="currentSection != settingsSection.Countdown">
                <h1>Countdown</h1>
                
                <form>
                    <tmt-datetimeentry [id]="'countdown'" [date]="launch.countdown" (dateChange)="onCountdownChanged($event)"></tmt-datetimeentry>
                </form>
                
                <p *ngIf="launchData.launch?.countdown != launch.countdown">New countdown of {{ launch.countdown.toISOString() }}</p>
            </section>
            
            <!-- INTRODUCTION -->
            <section [hidden]="currentSection != settingsSection.Introduction">
                <h1>Introduction</h1>
                <form>
                    <textarea name="introduction" [(ngModel)]="launch.introduction" placeholder="Introductory paragraph about the launch."></textarea>
                    <span>{{ launch.introduction?.length }} + characters.</span>
                </form>
            </section>
            
            <!-- DESCRIPTION SECTIONS -->
            <section [hidden]="currentSection != settingsSection.DescriptionSections">
                <h1>Description Sections</h1>
                
                <button (click)="addDescriptionSection()">Add Section</button>
                
                <ng-container *ngFor="let section of launch.descriptionSections">
                    <input type="text" placeholder="Section title" [(ngModel)]="section.title" />
                    <textarea placeholder="Section description" [(ngModel)]="section.description" ></textarea>
                    <button (click)="removeDescriptionSection(section)">Remove</button>
                </ng-container>
            </section>
            
            <!-- RESOURCES -->
            <section [hidden]="currentSection != settingsSection.Resources">
                <h1>Resources</h1>
                
                <button (click)="addResource()">Add Resource</button>
                
                <ng-container *ngFor="let resource of launch.resources">
                    <input type="text" placeholder="Resource Title" [(ngModel)]="resource.title" />
                    <input type="text" placeholder="Resource URL" [(ngModel)]="resource.url" />
                    <input type="text" placeholder="Resource Note" [(ngModel)]="resource.note" />          
                    <button (click)="removeResource(resource)">Remove</button>
                </ng-container>
            </section>
            
            <!-- LAUNCH EVENT TEMPLATES -->
            <section [hidden]="currentSection != settingsSection.LaunchEventTemplates">
                <h1>Launch Event Templates</h1>
            </section>
            
            <!-- ABOUT -->
            <section [hidden]="currentSection != settingsSection.About">
                <h1>About the App</h1>
                <p>Written by Luke. View on GitHub here: https://github.com/LukeNZ/tminusten.</p>
            </section>
            
            <!-- GLOBAL SETTINGS OPTIONS -->
            <div>
                <button (click)="liftoff()" [disabled]="settingsState.isLiftingOff">
                    {{ settingsState.isLiftingOff ? "Lifting off..." : "Liftoff" }}
                </button>
            </div>
        </div>
    `
})
/**
 * Settings. Appears as an overlaid window within the application either if no launch is actively running, or if the cog
 * settings icon is clicked. From here, changes to the description, title, webcasts, and other functionality can be made.
 * @class
 */
export class SettingsComponent implements OnInit {

    public settingsSection = SettingsSection;
    public currentSection: SettingsSection = this.settingsSection.General;

    public launch: Launch;

    public settingsState = {
        isLiftingOff: false,
        isSaving: false,
        tempCountdown: null
    };

    constructor(
        public websocketService : WebsocketService,
        public notificationBannerService: NotificationBannerService,
        public launchData: LaunchDataService,
        public appData: AppDataService
    ) {}

    /**
     * On component initialization,
     */
    public ngOnInit() : void {
        this.launchData.launchObservable().subscribe(data => {
            this.launch = Object.assign({}, data);
        });

        this.websocketService.appStatusResponsesStream().subscribe(response => {
            this.settingsState.isLiftingOff = false;
            this.notificationBannerService.notify("App Enabled.");
            this.launchData.launch = this.launch;
        });
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