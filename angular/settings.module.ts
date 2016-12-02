import {NgModule} from "@angular/core";
import {SettingsComponent} from "./Components/Settings.component";
import {AboutSettingsComponent} from "./Components/Settings/AboutSettings.component";
import {CountdownSettingsComponent} from "./Components/Settings/CountdownSettings.component";
import {DescriptionSectionsSettingsComponent} from "./Components/Settings/DescriptionSectionsSettings.component";
import {DisplaySettingsComponent} from "./Components/Settings/DisplaySettings.component";
import {GeneralSetupSettingsComponent} from "./Components/Settings/GeneralSetupSettings.component";
import {IntroductionSettingsComponent} from "./Components/Settings/IntroductionSettings.component";
import {LaunchMomentTemplatesSettingsComponent} from "./Components/Settings/LaunchMomentTemplatesSettings.component";
import {NotificationSettingsComponent} from "./Components/Settings/NotificationSettings.component";
import {ResourcesSettingsComponent} from "./Components/Settings/ResourcesSettings.component";
import {BulbComponent} from "./Components/Bulb.component";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {DateTimeEntryComponent} from "./Components/DateTimeEntry.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [
        SettingsComponent,
        BulbComponent,
        DateTimeEntryComponent,
        AboutSettingsComponent,
        CountdownSettingsComponent,
        DescriptionSectionsSettingsComponent,
        DisplaySettingsComponent,
        GeneralSetupSettingsComponent,
        IntroductionSettingsComponent,
        LaunchMomentTemplatesSettingsComponent,
        NotificationSettingsComponent,
        ResourcesSettingsComponent
    ],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule {}