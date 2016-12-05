import {Component, Input} from "@angular/core";
import {Launch} from "../../Interfaces/Launch";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'lp-description-sections-settings',
    template: `
        <h1>Description Sections</h1>            
        <form id="descriptionSectionsForm"></form>
        
        <button (click)="addDescriptionSection()">Add Section</button>
        
        <ul>
            <li *ngFor="let section of launch.descriptionSections">
                <input type="text" placeholder="Section title" [(ngModel)]="section.title" />
                <textarea placeholder="Section description" [(ngModel)]="section.description" ></textarea>
                <button (click)="removeDescriptionSection(section)">Remove</button>
            </li>
        </ul>

    `
})
export class DescriptionSectionsSettingsComponent {
    @Input() public launch: Launch;
}