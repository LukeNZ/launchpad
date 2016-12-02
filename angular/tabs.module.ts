import {NgModule} from "@angular/core";
import {DataComponent} from "./Components/Data.component";
import {AboutTabComponent} from "./Components/Tabs/AboutTab.component";
import {IncomingTelemetryTabComponent} from "./Components/Tabs/IncomingTelemetryTab.component";
import {TweetsImagesTabComponent} from "./Components/Tabs/TweetsImagesTab.component";
import {CommonModule} from "@angular/common";
import {LaunchStatusComponent} from "./Components/LaunchStatus.component";
import {AcronymsPipe} from "./Pipes/AcronymsPipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DataComponent,
        AboutTabComponent,
        IncomingTelemetryTabComponent,
        TweetsImagesTabComponent,
        LaunchStatusComponent,
        AcronymsPipe
    ],
    exports: [
        DataComponent
    ]
})
export class TabsModule {}