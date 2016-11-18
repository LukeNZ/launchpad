import {Component} from "@angular/core";
import {WebsocketService} from "../Services/WebsocketService";
import {NotificationBannerService} from "../Services/NotificationBannerService";
import {LaunchDataService} from "../Services/LaunchDataService";

enum SettingsSection {
    General, Countdown, Introduction, DescriptionSections, Resources, LaunchStatuses, About
}

@Component({
    selector:'tmt-settings',
    template: `
        <div>
            <nav>
                <ul>
                    <li (click)="currentSection = settingsSection.General">General</li>
                    <li (click)="currentSection = settingsSection.Countdown">Countdown</li>
                    <li (click)="currentSection = settingsSection.Introduction">Introduction</li>
                    <li (click)="currentSection = settingsSection.DescriptionSections">Description Sections</li>
                    <li (click)="currentSection = settingsSection.Resources">Resources</li>
                    <li (click)="currentSection = settingsSection.LaunchStatuses">Launch Statuses</li>
                    <li (click)="currentSection = settingsSection.About">About the App</li>
                </ul>
            </nav>
            
            <!-- GENERAL -->
            <section [hidden]="currentSection != settingsSection.General">
                <h1>General</h1>
                <p>General launch details and application settings.</p>
                
                <p *ngIf="launchModel.launch.name">Will appear on Reddit as: <span class="title">r/SpaceX {{ launchModel.launch.name }} Official Launch Discussion & Updates Thread</span></p>
                <form>
                    <label for="missionName">Mission Name</label>
                    <input type="text" name="missionName" [(ngModel)]="launchModel.launch.name" placeholder="Mission Name">
                </form>
            </section>
            
            <!-- COUNTDOWN -->
            <section [hidden]="currentSection != settingsSection.Countdown">
                <h1>Countdown</h1>
                
                <form>
                    <select name="liftoffHour">
                    
                    </select>
                    <select name="liftoffMinute">
                    
                    </select>
                     <select name="liftoffSecond">
                    
                    </select>
                    <select name="liftoffDate">
                    
                    </select>
                    <select name="liftoffMonth">
                    
                    </select>
                    <select name="liftoffYear">
                    
                    </select>
                </form>
            </section>
            
            <section [hidden]="currentSection != settingsSection.Introduction">
                <h1>Introduction</h1>
                <form>
                    <textarea [(ngModel)]="launchModel.launch.introduction" placeholder="Introduction."></textarea>
                </form>
            </section>
            
            <section [hidden]="currentSection != settingsSection.DescriptionSections">
                <h1>Description Sections</h1>
                
                <template ngFor let-section [ngForOf]="launchModel.launch.descriptionSections">
                    <input type="text" placeholder="Section title" />
                    <textarea placeholder="Section description">
                    
                    </textarea>
                </template>
            </section>
            
            <section [hidden]="currentSection != settingsSection.Resources">
                <h1>Resources</h1>
            </section>
            
            <section [hidden]="currentSection != settingsSection.LaunchStatuses">
                <h1>Launch Statuses</h1>
            </section>
            
            <section [hidden]="currentSection != settingsSection.About">
                <h1>About the App</h1>
                <p>Written by Luke.</p>
            </section>
            
            <div>
                <button (click)="launch()" [disabled]="settingsState.isLaunching">
                    {{ settingsState.isLaunching ? "Launching..." : "Launch" }}
                </button>
            </div>
        </div>
    `
})
/**
 * Settings. Appears as an overlaid window within the application either if no launch is actively running, or if the cog
 * settings icon is clicked. From here, changes to the description, title, webcasts, and other functionality can be made.
 */
export class SettingsComponent {

    public settingsSection = SettingsSection;
    public currentSection: SettingsSection = this.settingsSection.General;

    public settingsState = {
        isLaunching: false,
        isSaving: false
    };

    constructor(
        public websocketService : WebsocketService,
        public notificationBannerService: NotificationBannerService,
        public launchModel: LaunchDataService
    ) {}

    /**
     * Functionality to activate the T Minus Ten app. Is called by clicking the `launch` button from within the settings
     * menu. Emits an `appStatus` to the server of type "enableApp".
     */
    public launch(): void {
        this.settingsState.isLaunching = true;
        this.websocketService.emitAppStatus("enableApp", { missionName: this.launchModel.launch.name }).subscribe(response => {
            this.settingsState.isLaunching = false;
            this.notificationBannerService.notify("App Enabled.");
        });
    }
}