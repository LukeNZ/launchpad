import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {TMinusTenComponent} from "./Components/TMinusTen.component";
import {HeaderComponent} from "./Components/Header.component";
import {CountdownComponent} from "./Components/Countdown.component";
import {StatusBarComponent} from "./Components/StatusBar.component";
import {UpdatesComponent} from "./Components/Updates.component";
import {WebcastComponent} from "./Components/Webcast.component";
import {routing} from "./app.routes";
import {HomeComponent} from "./Components/Home.component";
import {InitializationService} from "./Services/InitializationService";
import {WebsocketService} from "./Services/WebsocketService";
import {LoginComponent} from "./Components/Login.component";
import {NotificationBannerComponent} from "./Components/NotificationBanner.component";
import {FormsModule} from "@angular/forms";
import {AuthService} from "./Services/AuthService";
import {TMinusTenService} from "./Services/TMinusTenService";
import {SettingsComponent} from "./Components/Settings.component";

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, routing],
    providers: [InitializationService, WebsocketService, AuthService, TMinusTenService],
    declarations: [TMinusTenComponent, HomeComponent, LoginComponent, HeaderComponent, CountdownComponent, StatusBarComponent,
        UpdatesComponent, WebcastComponent, NotificationBannerComponent, SettingsComponent],
    bootstrap: [TMinusTenComponent]
})
export class AppModule {}