// Modules
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {routing} from "./app.routes";
// Components
import {TMinusTenComponent} from "./Components/TMinusTen.component";
import {HomeComponent} from "./Components/Home.component";
import {HeaderComponent} from "./Components/Header.component";
import {CountdownComponent} from "./Components/Countdown.component";
import {StatusBarComponent} from "./Components/StatusBar.component";
import {LivestreamComponent} from "./Components/Livestream.component";
import {LoginComponent} from "./Components/Login.component";
import {NotificationBannerComponent} from "./Components/NotificationBanner.component";

// Services
import {InitializationService} from "./Services/InitializationService";
import {WebsocketService} from "./Services/WebsocketService";
import {AuthService} from "./Services/AuthService";
import {LaunchDataService} from "./Services/LaunchDataService";
import {NotificationBannerService} from "./Services/NotificationBannerService";
import {AppDataService} from "./Services/AppDataService";
import {SettingsModule} from "./settings.module";
import {TabsModule} from "./tabs.module";

@NgModule({
    // Modules
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        SettingsModule,
        TabsModule,
        routing
    ],
    // Services
    providers: [
        InitializationService,
        WebsocketService,
        AuthService,
        LaunchDataService,
        AppDataService,
        NotificationBannerService
    ],
    // Components
    declarations: [
        TMinusTenComponent,
        HomeComponent,
        LoginComponent,
        HeaderComponent,
        CountdownComponent,
        StatusBarComponent,
        LivestreamComponent,
        NotificationBannerComponent
    ],
    // Starting components
    bootstrap: [
        TMinusTenComponent
    ]
})
export class AppModule {}