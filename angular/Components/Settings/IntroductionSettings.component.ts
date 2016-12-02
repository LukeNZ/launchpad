import {Component, Input} from "@angular/core";
import {Launch} from "../../Interfaces/Launch";
@Component({
    selector: `tmt-introduction-settings`,
    template: `
        <h1>Introduction</h1>    
            <textarea name="introduction" [(ngModel)]="launch.introduction" placeholder="Introductory paragraph about the launch."></textarea>
        <span>{{ launch.introduction?.length }} characters.</span>
    `
})
export class IntroductionSettingsComponent {
    @Input() public launch: Launch;
}