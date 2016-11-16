import {Component} from "@angular/core";
import {WebsocketService} from "../Services/WebsocketService";

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
            
            <section [hidden]="currentSection != settingsSection.General">
                <h1>General</h1>
                
                <form>
                    <label for="missionName">Mission Name</label>
                    <input type="text" name="missionName" [(ngModel)]="model.missionName" placeholder="Mission Name">
                </form>
            </section>
            
            <section [hidden]="currentSection != settingsSection.Countdown">
                <h1>Countdown</h1>
            </section>
            
            <section [hidden]="currentSection != settingsSection.Introduction">
                <h1>Introduction</h1>
            </section>
            
            <section [hidden]="currentSection != settingsSection.DescriptionSections">
                <h1>Description Sections</h1>
            </section>
            
            <section [hidden]="currentSection != settingsSection.Resources">
                <h1>Resources</h1>
            </section>
            
            <section [hidden]="currentSection != settingsSection.LaunchStatuses">
                <h1>Launch Statuses</h1>
            </section>
            
            <section [hidden]="currentSection != settingsSection.About">
                <h1>About the App</h1>
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

    public model = {
        missionName: ""
    };

    public settingsState = {
        isLaunching: false,
        isSaving: false
    };

    constructor(public websocketService : WebsocketService) {}

    /**
     *
     */
    public launch(): void {
        this.settingsState.isLaunching = true;
        this.websocketService.emitAppStatus("foo", { missionName: this.model.missionName });
    }
}