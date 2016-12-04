import {Component, OnInit} from "@angular/core";
import {AppDataService} from "../Services/AppDataService";
import {Livestream} from "../Interfaces/Livestream";
import {UserPreferencesService} from "../Services/UserPreferencesService";

@Component({
    selector:'tmt-header',
    template: `
        <div class="header-area">
            <tmt-countdown></tmt-countdown>
            <ul class="quick-opts">
                <li *ngFor="let livestream of availableLivestreams">
                    <button (click)="toggleLivestreamVisibility(livestream)">{{ livestream.name }}</button>
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
                public userPrefs: UserPreferencesService) {}

    public toggleLivestreamVisibility(livestream: Livestream) : void {
        //this.userPrefs.livestreamsVisible.splice(this.userPrefs.livestreamsVisible.indexOf(livestream.name), 1
    }

    public rotateNestedLivestreams() : void {
        // Grab the current main livestream
        console.log(this.userPrefs.visibleLivestreams);


        // Grab the first livestream from the livestreams list which isn't the main
        /*let livestreamToMakeMain = this.userPrefs.visibleLivestreams
            .filter(l => l.name !== this.userPrefs.livestreamMainIfNested)[0];

        this.userPrefs.visibleLivestreams.splice(this.userPrefs.visibleLivestreams.indexOf(livestreamToMakeMain), 1);
        this.userPrefs.visibleLivestreams.unshift(livestreamToMakeMain);

        // Shouldn't be possible as the command to rotate through the livestreams is not visible if there
        // is only one visible livestream
        if (livestreamToMakeMain != null) {
            this.userPrefs.livestreamMainIfNested = livestreamToMakeMain.name;
            console.log(this.userPrefs.livestreamMainIfNested);
        }*/
    }
}