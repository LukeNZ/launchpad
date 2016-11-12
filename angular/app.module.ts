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
import {TMinusTenService} from "./Services/TMinusTenService";
import {WebsocketService} from "./Services/WebsocketService";

@NgModule({
    imports: [BrowserModule, HttpModule, routing],
    providers: [TMinusTenService, WebsocketService],
    declarations: [TMinusTenComponent, HomeComponent, HeaderComponent, CountdownComponent, StatusBarComponent, UpdatesComponent, WebcastComponent],
    bootstrap: [TMinusTenComponent]
})
export class AppModule {}