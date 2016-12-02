import {Component, Input} from "@angular/core";
import {Launch} from "../../Interfaces/Launch";
import {Livestream} from "../../Interfaces/Livestream";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'tmt-general-setup-settings',
    template: `
        <section>
            <h1>General Setup</h1>
            <p>General launch setup details and specific application settings.</p>
            
            <h2>Launch Name</h2>
            <p *ngIf="launch.name">Will appear on Reddit as: <span class="title">r/SpaceX {{ launch.name }} Official Launch Discussion & Updates Thread</span></p>
            
            <label for="name">Mission Name</label>
            <input type="text" name="name" [(ngModel)]="launch.name" placeholder="Mission Name" form="liftoffForm" />
            
            <h2>Livestreams</h2>      
            <ul>
                <li *ngFor="let livestream of livestreams">
                    <input type="checkbox"
                    [(ngModel)]="livestream.isAvailable" form="liftoffForm" /> 
                    <label>{{ livestream.name }}</label>
                </li>
            </ul>
        </section>

    `
})
export class GeneralSetupSettingsComponent {
    @Input() public launch: Launch;
    @Input() public livestreams: Livestream[];

    public lowercaseLive
}