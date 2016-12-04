import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LivestreamComponent} from "./Components/Livestream.component";
import {GuardSharedService} from "./Services/GuardSharedService";
import {LivestreamPlayerComponent} from "./Components/LivestreamPlayer.component";
import {MovableDirective} from "./Directives/Movable.directive";
import {SanitizePipe} from "angular-toolshed/angular-toolshed";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LivestreamComponent,
        LivestreamPlayerComponent,
        MovableDirective,
        SanitizePipe
    ],
    providers: [
        GuardSharedService
    ],
    exports: [
        LivestreamComponent
    ]
})
export class LivestreamsModule {}