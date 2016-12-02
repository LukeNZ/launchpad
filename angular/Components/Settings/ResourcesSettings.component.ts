import {Component, Input} from "@angular/core";
import {Launch} from "../../Interfaces/Launch";

@Component({
    selector: 'tmt-resources-settings',
    template: `
        <h1>Resources</h1>            
        <form id="resourcesForm"></form>
        
        <button (click)="addResource()">Add Resource</button>
        
        <ng-container *ngFor="let resource of launch.resources">
            <input type="text" placeholder="Resource Title" [(ngModel)]="resource.title" />
            <input type="text" placeholder="Resource URL" [(ngModel)]="resource.url" />
            <input type="text" placeholder="Resource Note" [(ngModel)]="resource.note" />          
            <button (click)="removeResource(resource)">Remove</button>
        </ng-container>
    `
})
export class ResourcesSettingsComponent {
    @Input() public launch: Launch;
}