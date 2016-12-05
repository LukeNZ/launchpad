import {Component, Input} from "@angular/core";
import {Launch} from "../../Interfaces/Launch";
@Component({
    selector: `lp-introduction-settings`,
    template: `
        <h1>Introduction</h1>    
            <textarea name="introduction" [(ngModel)]="launch.introduction" placeholder="Introductory paragraph about the launch." minlength="100" maxlength="2000"></textarea>
        <span>{{ launch.introduction?.length }} characters.</span>
    `
})
export class IntroductionSettingsComponent {
    @Input() public launch: Launch;
}