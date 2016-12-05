import {Component, OnInit} from "@angular/core";
import {AppDataService} from "../Services/AppDataService";
import {Livestream} from "../Interfaces/Livestream";
import {UserPreferencesService} from "../Services/UserPreferencesService";
import {LaunchDataService} from "../Services/LaunchDataService";

@Component({
    selector:'tmt-header',
    template: `
        <div class="header-area">
            <tmt-countdown></tmt-countdown>
            <span>{{ launchData.launch.name }} Mission</span>
            <ul class="quick-opts">
                <li *ngFor="let livestream of availableLivestreams">
                    <button (click)="toggleLivestreamVisibility(livestream)">{{ livestream.name }}</button>
                </li>
                <li>
                    <button (click)="switchModes()">Switch to {{ userPrefs.livestreamPositioningMode === 'nested' ? 'nested' : 'linear' }} mode</button>
                </li>
                <li *ngIf="userPrefs.livestreamPositioningMode === 'nested' && userPrefs.visibleLivestreams.length > 1">
                    <button (click)="rotateNestedLivestreams()">Rotate</button>
                </li>
                <li>
                    <i (click)="appData.isSettingsVisible = true">Settings</i>
                </li>
            </ul>
            
        </div>       
    `
})
export class HeaderComponent {
    public availableLivestreams : Livestream[] = this.appData.availableLivestreams();

    constructor(public appData: AppDataService,
                public launchData: LaunchDataService,
                public userPrefs: UserPreferencesService) {}

    public toggleLivestreamVisibility(livestream: Livestream) : void {
        //this.userPrefs.livestreamsVisible.splice(this.userPrefs.livestreamsVisible.indexOf(livestream.name), 1
    }

    public rotateNestedLivestreams() : void {
        // shift element off _visibleLivestreams
        let elem = this.userPrefs.visibleLivestreams.shift();
        // push element onto _visibleStreams
        this.userPrefs.visibleLivestreams.push(elem);
    }
}