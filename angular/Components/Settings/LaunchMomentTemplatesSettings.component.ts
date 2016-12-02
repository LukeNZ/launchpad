import {Component, Input} from "@angular/core";
import {MomentTemplate} from "../../Interfaces/MomentTemplate";

@Component({
    selector: 'tmt-launch-moment-templates-settings',
    template: `
        <h1>Launch Moment Templates</h1>            
        <form id="lauchMomentTemplatesForm"></form>
        
        <ng-container *ngFor="let momentTemplate of launchMomentTemplates">
            <p>{{ momentTemplate.title }}</p>
            <textarea>{{ momentTemplate.text }}</textarea>
        </ng-container>
        <button>Save</button>
    `
})
export class LaunchMomentTemplatesSettingsComponent {
    @Input() public launchMomentTemplates: MomentTemplate[];
}