// Modules
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {routing} from "./app.routes";

// Components
import {LaunchpadComponent} from "./Components/Launchpad.component";
import {HomeComponent} from "./Components/Home.component";
import {HeaderComponent} from "./Components/Header.component";
import {CountdownComponent} from "./Components/Countdown.component";
import {StatusBarComponent} from "./Components/StatusBar.component";
import {LoginComponent} from "./Components/Login.component";
import {NotificationBannerComponent} from "./Components/NotificationBanner.component";

// Services
import {InitializationService} from "./Services/InitializationService";
import {WebsocketService} from "./Services/WebsocketService";
import {AuthService} from "./Services/AuthService";
import {LaunchDataService} from "./Services/LaunchDataService";
import {NotificationBannerService} from "./Services/NotificationBannerService";
import {AppDataService} from "./Services/AppDataService";

// Other modules
import {SettingsModule} from "./settings.module";
import {TabsModule} from "./tabs.module";
import {LivestreamsModule} from "./livestreams.module";
import {UserPreferencesService} from "./Services/UserPreferencesService";

@NgModule({
    // Modules
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        SettingsModule,
        TabsModule,
        LivestreamsModule,
        routing
    ],
    // Services
    providers: [
        InitializationService,
        WebsocketService,
        AuthService,
        LaunchDataService,
        AppDataService,
        NotificationBannerService,
        UserPreferencesService
    ],
    // Components
    declarations: [
        LaunchpadComponent,
        HomeComponent,
        LoginComponent,
        HeaderComponent,
        CountdownComponent,
        StatusBarComponent,
        NotificationBannerComponent
    ],
    // Starting components
    bootstrap: [
        LaunchpadComponent
    ]
})
export class AppModule {}